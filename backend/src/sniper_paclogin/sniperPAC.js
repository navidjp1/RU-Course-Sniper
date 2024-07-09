const pt = require("puppeteer");
var axios = require("axios").default;

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

let username = "";
let password = "";
let timeArray = [];
let ids = [];
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
            ids.forEach(async (id) => {
                if (response.data.includes(id)) {
                    console.log(`Course index: ${id} was found!`);
                    //await register(id);
                }
            });
        })
        .catch(function (error) {
            console.error("Error sending api request: " + error);
        });

    requestCount++;
}

async function runSniper(RUID, PAC, courseIDs, restartTime, shouldRun) {
    if (shouldRun && !isRunning) {
        isRunning = true;

        username = RUID;
        password = PAC;
        ids = courseIDs;
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

    if (!relogin) console.log("Successfully logged in!");
    else console.log("Successfully re-logged in!");
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
        await page.waitForSelector("#semesterSelection3", { timeout: timeout });
        await page.click("#semesterSelection3");
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
    if ((await page.$("#semesterSelection3")) != null) {
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
        await page.waitForSelector("#j_username, #semesterSelection3", {
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

async function register(course_ID) {
    let addAndDrop = true;

    if (course_ID == "07636") {
        addAndDrop = false;
        await add(course_ID);
    }

    if (addAndDrop) {
        let which_id = 5;
        let which_course = "10486";

        // if (course_ID == '07589' || course_ID == '07590' || course_ID == '07591' || course_ID == '07592') {
        //     which_id = 1;
        //     which_course = '07609';
        // }

        await drop(which_id);

        await add(course_ID);

        await add(which_course); // attempting to re-add dropped course
    }

    console.log(`Successfully tried to register for ${course_ID}!`);

    // take screenshot of page after trying to register
}

async function drop(which_id) {
    try {
        await page.waitForSelector(
            `::-p-xpath(/html/body/div[2]/div[2]/dl[${which_id}]/dt/form/input[2])`
        );

        page.on("dialog", async (dialog) => {
            await dialog.accept();
        });

        await page.click(
            `::-p-xpath(/html/body/div[2]/div[2]/dl[${which_id}]/dt/form/input[2])`
        ); // dl[5] = dropping 5th course on user's WebReg screen

        console.log("Dropped course!");
    } catch (err) {
        console.log("Drop button not found");
        await quickReload();
        await drop(which_id);
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

module.exports = { runSniper };
