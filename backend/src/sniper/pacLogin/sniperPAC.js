import pt from "puppeteer";
import axios from "axios";
import { getUserCurrentCourses } from "./utils.js";

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

let username = "";
let password = "";
let timeArray = [];
let ids = [];
let userCurrentCourses = [];
let page = null;
let browser = null;

let isRunning = false;
let shouldRestart = false;
let errorCount = 0;
let requestCount = 0;
let timeout = 30000;

async function sendRequest(ids) {
    axios
        .request({
            method: "GET",
            url: "https://classes.rutgers.edu/soc/api/openSections.json",
            params: { year: "2024", term: "9", campus: "NB" },
        })
        .then(function (response) {
            ids.forEach(async (idObj) => {
                const id = idObj.add;
                if (response.data.includes(id)) {
                    console.log(`Course index: ${id} was found!`);
                    //await register(idObj);
                }
            });
        })
        .catch(function (error) {
            console.error("Error sending api request: " + error);
        });

    requestCount++;
}

async function runSniper(RUID, PAC, idObjects, restartTime, shouldRun) {
    if (shouldRun && !isRunning) {
        isRunning = true;

        username = RUID;
        password = PAC;
        ids = idObjects;
        timeArray = restartTime;

        console.log("Launching browser...");
        browser = await pt.launch({ headless: false });
        page = await browser.newPage();

        await page.goto(url);
        await authenticate(false);

        while (isRunning) {
            await sendRequest(ids);

            if (requestCount % 10 == 0) {
                console.log(`${requestCount} iterations completed.`);
                if (requestCount % 200 == 0) {
                    await checkTime();
                    await authenticate(true);
                }
            }

            await new Promise((resolve) => setTimeout(resolve, 4000));
        }
        console.log("Closed browser...");
        browser.close();
    } else if (!shouldRun && isRunning) {
        isRunning = false;
        console.log("Auto-sniper stopped.\n\n");
    } else if (!shouldRun && !isRunning) {
        console.log("Auto-sniper already stopped.");
    } else {
        console.log("Auto-sniper already running.");
    }

    if (shouldRestart) {
        //await delay(timeout);
        isRunning = false;
        shouldRestart = false;
        errorCount = 0;
        requestCount = 0;
        timeout = 30000;
        await delay(timeout);
        await runSniper(username, password, ids, restartTime, true);
    }
    return true;
}

async function authenticate(relogin) {
    if (relogin) {
        await logout();
    }

    await login();

    await semesterSelection();

    await bypassLoadingScrn();

    if (!relogin) {
        try {
            userCurrentCourses = await getUserCurrentCourses(page);
        } catch (error) {
            console.log("Could not fetch user current courses: " + error);
            await errorFunc();
        }
        console.log("Successfully logged in!");
    } else console.log("Successfully re-logged in!");
}

async function login() {
    try {
        await page.waitForSelector("#j_username", { timeout: timeout });
        await page.type("#j_username", username, { delay: 100 });

        await page.waitForSelector("#j_password");
        await page.type("#j_password", password, { delay: 100 });

        await page.waitForSelector("#submit");
        await page.click("#submit");
    } catch (err) {
        console.log("User/pass fields not found/not needed");
        await errorFunc();
    }
}

async function logout() {
    try {
        await page.waitForSelector("#logout a", { timeout: timeout });
        await page.click("#logout a");

        await page.goto(url);
    } catch (err) {
        console.log("Logout button not found; trying to login again...");
        await errorFunc();
    }
}

async function semesterSelection() {
    try {
        await page.waitForSelector("#semesterSelection4", { timeout: timeout });
        await page.click("#semesterSelection4");
        await page.click("#submit");
    } catch (err) {
        console.log("Semester selection button not found");
        await errorFunc();
    }
}

async function errorFunc() {
    if (!isRunning && shouldRestart) return;

    console.log("There has been an error, trying to fix it.");
    await checkTime();
    errorCount++;
    if (errorCount >= 3) {
        await restartSniper();
        return;
    }

    await reloadPage();

    await checkForElements();
    if ((await page.$("#j_username")) != null) {
        await login();
    }

    await checkForElements();
    if ((await page.$("#semesterSelection4")) != null) {
        await semesterSelection();
    }

    try {
        await page.waitForSelector("#i1", { timeout: timeout });
    } catch (err) {
        console.log("Could not find input box. Reloading page...");
        await errorFunc();
    }

    if (isRunning) {
        console.log("Successfully handled error and refreshed page!");
        errorCount = 0;
    }
}

async function checkTime() {
    if (!isRunning && shouldRestart) return;

    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let time = hour * 60 + minute;
    let whenToRestart = timeArray[0] * 60 + timeArray[1]; // restarts program after user's preferred time

    console.log(`It is ${hour}:${minute}:${second}.`);

    if (time <= whenToRestart + 15 && time >= whenToRestart) {
        console.log(`It is ${hour}:${minute}. Restarting program...`);
        await delay(250000);
        await restartSniper();
        return;
    }

    if (time <= 6 * 60 + 5 && time >= 1 * 60 + 55) {
        console.log(`It is ${hour}:${minute}. WebReg is down...`);
        let timeout = (6 * 60 + 10 - time) * 60;
        console.log(`Halting program for ${timeout} seconds.`);
        await delay(timeout * 1000);
        await reloadPage();
        await semesterSelection();
        await bypassLoadingScrn();
        console.log("Successfully re-logged in!");
    }
}

async function restartSniper() {
    console.log("Restarting sniper...");
    isRunning = false;
    shouldRestart = true;
    timeout = 5000;
}

async function reloadPage() {
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    await page.goto(url);
    await delay(5000);
}

async function quickReload() {
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    await semesterSelection();
}

async function checkForElements() {
    try {
        await page.waitForSelector("#j_username, #semesterSelection4", {
            timeout: timeout,
        });
    } catch (err) {
        console.log("Cannot find any elements on the page.");
        await errorFunc();
    }
}

async function bypassLoadingScrn() {
    try {
        await page.waitForSelector(".spField, #i1", { timeout: timeout });
    } catch (err) {
        console.log("Could not find input box. Reloading page...");
        await quickReload();
    }

    if ((await page.$("#i1")) == null) {
        await quickReload();
    }
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

// async function foundError(error) {
//     console.log ("There was an error while searching for elements: " + error)
//     await errorFunc();
// }

async function testRegister(idObject) {
    const addID = idObject.add;
    const dropIDArray = idObject.drop;

    if (dropIDArray.length === 0) {
        console.log("Will add: ", addID);
    } else {
        for (const dropID of dropIDArray) {
            const dropIDNumber = userCurrentCourses.indexOf(dropID) + 1;
            if (dropIDNumber === -1) {
                return;
            }
            console.log("Will drop id: ", dropID, " at index: ", dropIDNumber);
        }
        console.log("Will add: ", addID);

        // if course not successfully added, re-add dropped courses
        for (const dropID of dropIDArray) {
            console.log("Will add: ", dropID);
        }
    }

    console.log(`Successfully tried to register for ${addID}!`);

    // take screenshot of page after trying to register
}

async function register(idObject) {
    const addID = idObject.add;
    const dropIDArray = idObject.drop;

    if (dropIDArray.length === 0) {
        await add(addID);
    } else {
        for (const dropID of dropIDArray) {
            const dropIDNumber = userCurrentCourses.indexOf(dropID) + 1;
            if (dropIDNumber === -1) {
                return;
            }
            await drop(dropIDNumber);
        }
        await add(addID);

        // if course not successfully added, re-add dropped courses
        for (const dropID of dropIDArray) {
            await add(dropID);
        }
    }

    console.log(`Successfully tried to register for ${course_ID}!`);

    // take screenshot of page after trying to register
}

async function drop(idNum) {
    try {
        await page.waitForSelector(
            `::-p-xpath(/html/body/div[2]/div[2]/dl[${idNum}]/dt/form/input[2])`
        );

        page.on("dialog", async (dialog) => {
            await dialog.accept();
        });

        await page.click(
            `::-p-xpath(/html/body/div[2]/div[2]/dl[${idNum}]/dt/form/input[2])`
        ); // dl[5] = dropping 5th course on user's WebReg screen

        console.log("Dropped course!");
    } catch (err) {
        console.log("Drop button not found");
        await quickReload();
        await drop(idNum);
    }

    await bypassLoadingScrn();
}

async function add(id) {
    try {
        await page.waitForSelector("#i1");
        await page.type("#i1", id, { delay: 100 });
        await page.click("#submit");
    } catch (err) {
        console.log("Add course input not found");
        await quickReload();
        await add(id);
    }

    await bypassLoadingScrn();
}

export default runSniper;
