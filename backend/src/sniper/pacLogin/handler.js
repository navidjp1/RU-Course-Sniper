import "dotenv/config";
import pt from "puppeteer";
import userModel from "../../models/User.js";
import { delay } from "../../utils.js";
import { login, relogin } from "./login.js";
import { register } from "./snipe.js";
import { updateUserPositions } from "../../controllers/courses.js";
import { getCachedCourses } from "../../proxy/proxyHandler.js";

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

let requestCount = 0;
let errorCount = 0;
let restartCount = 0;
let isRunning = false;
let shouldRestart = false;

let context = null;
let page = null;

let ids = [];

async function sendRequest(uid) {
    try {
        const response = await getCachedCourses();
        if (response.error) {
            throw new Error(response.error);
        }
        ids.forEach(async (idObj) => {
            const id = idObj.add;
            if (response.includes(id)) {
                console.log(`Course index: ${id} was found!`);
                // const { status, message } = await register(idObj);
                // if (status == 200) {
                //     await handleAfterRegister(uid, id);
                //     return true;
                // }
                // console.log(message);
            }
        });
    } catch (error) {
        console.error(`Error fetching open courses: ${error}`);
    }

    requestCount++;
    return false;
}

async function handleAfterRegister(uid, id) {
    try {
        const user = await userModel.findOne({ uid });
        const idObjects = user.courseIDs;
        const id = idObjects.find((obj) => obj.add === id);
        const oldPosition = id.position;
        id.status = "REGISTERED";
        id.position = -1;
        await user.save();
        ids = ids.filter((obj) => obj.add !== id);

        await updateUserPositions(id, oldPosition);
    } catch (error) {
        console.error(`Could not update course status for id ${id}: ${error}`);
    }
}

export const handleSniper = async (shouldRun, RUID, PAC, idObjects, uid) => {
    if (shouldRun && !isRunning) {
        isRunning = true;

        console.log("Starting sniper browser for RUID: " + RUID);
        const browser = await pt.launch();
        // const browser = await pt.launch({
        //     executablePath:
        //         process.env.NODE_ENV === "production"
        //             ? process.env.PUPPETEER_EXECUTABLE_PATH
        //             : pt.executablePath(),
        // });
        context = await browser.createBrowserContext();
        page = await context.newPage();
        await page.setDefaultTimeout(15000);

        const { status, message } = await login(RUID, PAC, page);
        if (status != 200) await errorHandler(message, RUID, PAC);

        ids = idObjects;

        while (isRunning) {
            const registered = await sendRequest(uid);

            if (registered) {
                page.setDefaultTimeout(5000);
                shouldRestart = true;
                isRunning = false;
                restartCount = ids.length === 0 ? 5 : restartCount - 1;
            } else {
                if (requestCount % 10 == 0) {
                    console.log(`${requestCount} iterations completed. RUID: ${RUID}`);
                    // change back to 200
                    if (requestCount % 50 == 0) {
                        await checkTime();
                        const { status, message } = await relogin();
                        if (status != 200) await errorHandler(message, RUID, PAC);
                    }
                }
            }
            await delay(4000);
        }

        console.log("Closing browser... -> " + RUID);
        await browser.close();
    } else {
        isRunning = false;
        console.log("Auto-sniper stopped. -> " + RUID);
    }

    if (shouldRestart && restartCount < 3) {
        console.log("Auto-sniper restarting... -> " + RUID);
        console.log(`Restart count: ${restartCount}`);
        isRunning = false;
        shouldRestart = false;
        errorCount = 0;
        requestCount = 0;
        restartCount += 1;
        await delay(30000);
        await handleSniper(true, RUID, PAC, ids);
    }

    console.log(`Program halted for ${RUID}.\n`);
    return true;
};

async function checkTime() {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let time = hour * 60 + minute;

    console.log(`It is ${hour}:${minute}:${second}.`);

    if (time <= 6 * 60 + 5 && time >= 1 * 60 + 55) {
        console.log(`It is ${hour}:${minute}. WebReg is down...`);
        let timeout = (6 * 60 + 10 - time) * 60;
        console.log(`Halting program for ${timeout} seconds.`);
        await delay(timeout * 1000);

        // check whether large delay causes any issues
    }
}

async function errorHandler(message, RUID, PAC) {
    if (!isRunning && shouldRestart) return;

    errorCount++;
    console.log(`Error #${errorCount}: ${message}`);

    if (errorCount <= 2) {
        // open new page
        await page.close();
        page = await context.newPage();
        await page.setDefaultTimeout(15000);
        const { status, message } = await login(RUID, PAC, page);
        if (status == 200) {
            errorCount = 0;
            return;
        }
    }
    page.setDefaultTimeout(5000);
    shouldRestart = true;
    isRunning = false;
}
