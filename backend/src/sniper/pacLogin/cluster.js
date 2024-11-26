import "dotenv/config";
import pt from "puppeteer";
import userModel from "../../models/User.js";
import { delay } from "../../utils.js";
import { login, relogin } from "./login.js";
import { register } from "./snipe.js";
import { updateUserPositions } from "../../controllers/courses.js";
import { getCachedCourses } from "../../proxy/proxyHandler.js";

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

class puppeteerManager {
    constructor(RUID, PAC, uid, idObjects) {
        this.RUID = RUID;
        this.PAC = PAC;
        this.uid = uid;
        this.ids = idObjects;
        this.isRunning = false;
        this.requestCount = 1;
        this.errorCount = 1;
        this.restartCount = 1;
        this.browser = null;
    }

    async sendRequest(page) {
        try {
            const response = await getCachedCourses();
            if (response.error) {
                throw new Error(response.error);
            }

            for (const idObj of this.ids) {
                const id = idObj.add;
                if (response.includes(id)) {
                    console.log(`Course index: ${id} was found!`);
                    const { status, message } = await register(idObj, page);
                    console.log(message);
                    if (status == 200) {
                        await this.handleAfterRegister(this.uid, id);
                    }
                    if (this.ids.length == 0) {
                        await this.stopBrowser();
                        await this.setCoursesInactive();
                    } else {
                        this.restartCount--;
                        this.restartBrowser();
                    }
                }
            }
        } catch (error) {
            console.error(`Error fetching open courses: ${error}`);
        }
    }

    async handleAfterRegister(uid, courseId) {
        try {
            this.ids = this.ids.filter((obj) => obj.add !== courseId);

            const user = await userModel.findOne({ uid });
            const idObjects = user.courseIDs;
            const idObj = idObjects.find((obj) => obj.add === courseId);
            const oldPosition = idObj.position;
            idObj.status = "REGISTERED";
            idObj.position = -1;
            await user.save();

            await updateUserPositions(courseId, oldPosition);
        } catch (error) {
            console.error(
                `Could not update course status for courseId ${courseId}: ${error}`
            );
        }
    }

    async startBrowser() {
        if (this.isRunning) return false;

        this.isRunning = true;

        console.log("Starting sniper browser for RUID: " + this.RUID);

        const browser = await pt.launch({
            headless: true,
            executablePath:
                process.env.NODE_ENV === "production"
                    ? process.env.PUPPETEER_EXECUTABLE_PATH
                    : pt.executablePath(),
        });

        this.browser = browser;

        const context = await browser.createBrowserContext();
        let page = await context.newPage();
        await page.setDefaultTimeout(15000);

        const { status, message } = await login(this.RUID, this.PAC, page);
        if (status != 200) {
            page = await this.errorHandler(message, page, context);
        }

        while (this.isRunning) {
            if (this.requestCount % 25 == 0) {
                console.log(
                    `${this.requestCount} iterations completed. RUID: ${this.RUID}`
                );
                if (this.requestCount % 200 == 0) {
                    await this.checkTime();
                    const { status, message } = await relogin(this.RUID, this.PAC, page);
                    if (status != 200) {
                        page = await this.errorHandler(message, page, context);
                    }
                }
            }

            this.requestCount++;

            if (page) await this.sendRequest(page);

            await delay(4000);
        }

        console.log(`Program halted for ${this.RUID}.\n`);
    }

    async stopBrowser() {
        if (!this.isRunning || !this.browser) return false;

        console.log("Stopping sniper... -> " + this.RUID);
        await this.browser.close();
        this.isRunning = false;
        this.requestCount = 1;
        this.errorCount = 1;
        this.restartCount = 1;
        this.browser = null;

        return true;
    }

    async restartBrowser() {
        console.log("Restarting sniper... -> " + this.RUID);
        console.log(`Restart count: ${this.restartCount}`);
        const prevRestartCount = this.restartCount;
        await this.stopBrowser();

        console.log("Waiting 15 seconds...");
        await delay(15000);
        this.restartCount = prevRestartCount + 1;
        this.startBrowser();
    }

    async errorHandler(message, page, context) {
        if (!this.isRunning) return;

        this.errorCount++;
        console.log(`Error #${this.errorCount}: ${message}`);

        if (this.errorCount <= 2) {
            // open new page
            await page.close();
            page = await context.newPage();
            await page.setDefaultTimeout(30000);
            const { status, message } = await login(this.RUID, this.PAC, page);
            if (status == 200) {
                this.errorCount = 1;
                return page;
            }
        }

        if (this.restartCount <= 3) {
            this.restartBrowser();
        } else {
            await this.stopBrowser();
            await this.setCoursesInactive();
        }
        return null;
    }

    async setCoursesInactive() {
        const uid = this.uid;
        const user = await userModel.findOne({ uid });
        user.isSniping = false;
        user.courseIDs.forEach((obj) => {
            if (obj.status === "SNIPING") {
                obj.status = "INACTIVE";
            }
        });
        await user.save();
    }

    async checkTime() {
        let date = new Date();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        let time = hour * 60 + minute;

        console.log(`It is ${hour}:${minute}:${second} UTC.`);

        const downtimeStart = 6 * 60 + 55;
        const downtimeEnd = 11 * 60 + 5;

        // const downtimeStart = 1 * 60 + 55;
        // const downtimeEnd = 6 * 60 + 5;

        if (time <= downtimeEnd && time >= downtimeStart) {
            console.log(`It is ${hour}:${minute} UTC. WebReg is down...`);
            let timeout = (downtimeEnd - time) * 60;
            console.log(`Halting program for ${timeout} seconds.`);
            await delay(timeout * 1000);

            // check whether large delay causes any issues
        }
    }
}

export default puppeteerManager;
