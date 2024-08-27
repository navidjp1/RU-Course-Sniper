import pt from "puppeteer";
import axios from "axios";
import { delay } from "./utils";
import { login, relogin } from "./login";

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

let requestCount = 0;
let errorCount = 0;
let restartCount = 0;
let isRunning = false;
let shouldRestart = false;

let context = null;
let page = null;

async function sendRequest(idObjects) {
    try {
        const response = await axios.get("http://localhost:4000/api/courses");
        idObjects.forEach(async (idObj) => {
            const id = idObj.add;
            if (response.data.includes(id)) {
                console.log(`Course index: ${id} was found!`);
                // const { status, message } = await register(idObj);
                if (status == 200) return true; // needs further implementation
            }
        });
    } catch (error) {
        console.error(`Error fetching open courses: ${error}`);
    }

    requestCount++;
    return false;
}

export const handleSniper = async (shouldRun, RUID, PAC, idObjects) => {
    if (shouldRun && !isRunning) {
        isRunning = true;
        console.log("Launching browser...");
        const browser = await pt.launch({ headless: false });
        context = await browser.createBrowserContext();
        page = await context.newPage();
        await page.setDefaultTimeout(15000);

        const { status, message } = await login(RUID, PAC, page);
        if (status != 200) await errorHandler(message, RUID, PAC);

        while (isRunning) {
            const registered = await sendRequest(idObjects);
            // TODO: update status message but continue sniping other courses if present

            if (requestCount % 10 == 0) {
                console.log(`${requestCount} iterations completed.`);
                if (requestCount % 200 == 0) {
                    await checkTime();
                    const { status, message } = await relogin();
                    if (status != 200) await errorHandler(message, RUID, PAC);
                }
            }

            await new Promise((resolve) => setTimeout(resolve, 4000));
        }

        console.log("Closing browser...");
        await browser.close();
    } else {
        isRunning = false;
        console.log("Auto-sniper stopped.\n\n");
    }

    if (shouldRestart && restartCount < 3) {
        console.log("Auto-sniper restarting...");
        isRunning = false;
        shouldRestart = false;
        errorCount = 0;
        requestCount = 0;
        restartCount += 1;
        await delay(30000);
        await handleSniper(true);
    }

    console.log("Program halted.");
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

export const errorHandler = async (message, RUID, PAC) => {
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
};
