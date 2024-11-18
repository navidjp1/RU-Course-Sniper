import pt from "puppeteer";
import axios from "axios";
import userModel from "../../models/User.js";
import { delay } from "../../utils.js";
import { login, relogin } from "./login.js";
import { register } from "./snipe.js";
import { updateUserPositions } from "../../controllers/courses.js";

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
        const response = await axios.get("http://localhost:4000/api/courses");
        ids.forEach(async (idObj) => {
            const id = idObj.add;
            if (response.data.includes(id)) {
                console.log(`Course index: ${id} was found!`);
                // const { status, message } = await register(idObj);
                // if (status == 200) {
                //     await handleAfterRegister(uid, id);
                //     return true;
                // }
                console.log(message);
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

export const handleSniper = async (shouldRun, RUID, PAC, idObjects, uid, browser) => {
    if (shouldRun && !isRunning) {
        isRunning = true;

        console.log("Setting up page...");
        // const browser = await pt.launch({ headless: true });
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
                    console.log(`${requestCount} iterations completed.`);
                    if (requestCount % 200 == 0) {
                        await checkTime();
                        const { status, message } = await relogin();
                        if (status != 200) await errorHandler(message, RUID, PAC);
                    }
                }
            }
            await delay(4000);
        }

        console.log("Closing browser...");
        await browser.close();
    } else {
        isRunning = false;
        console.log("Auto-sniper stopped.");
    }

    if (shouldRestart && restartCount <= 3) {
        console.log("Auto-sniper restarting...");
        isRunning = false;
        shouldRestart = false;
        errorCount = 0;
        requestCount = 0;
        restartCount += 1;
        await delay(30000);
        await handleSniper(true, RUID, PAC, ids);
    }

    console.log("Program halted.\n");
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
