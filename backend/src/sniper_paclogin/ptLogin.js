const {
    delay,
    checkForElements,
    reloadPage,
    restartProgram,
    bypassLoadingScrn,
} = require("./ptHelpers");

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";
let relogin = false;
let errorCount = 0;
let username = "";
let password = "";
let timeArray = [];

async function authenticate(
    page,
    reloginVar,
    usernameVar,
    passwordVar,
    timeArrayVar
) {
    relogin = reloginVar;
    username = usernameVar;
    password = passwordVar;
    timeArray = timeArrayVar;
    if (relogin) {
        await logout(page);
    }

    await login(page);

    await semesterSelection(page);

    await bypassLoadingScrn(page);

    if (!relogin) console.log("Successfully logged in!");
    else console.log("Successfully re-logged in!");
}

async function login(page) {
    try {
        await page.waitForSelector("#j_username");
        await page.type("#j_username", username, { delay: 100 });

        await page.waitForSelector("#j_password");
        await page.type("#j_password", password, { delay: 100 });

        await page.waitForSelector("#submit");
        await page.click("#submit");
    } catch (err) {
        console.log("User/pass fields not found/not needed, error: " + err);
        await errorFunc(page);
    }
}

async function logout(page) {
    try {
        await page.waitForSelector("#logout a");
        await page.click("#logout a");

        await page.goto(url);
    } catch (err) {
        console.log("Logout button not found; trying to login again...");
        await errorFunc(page);
    }
}

async function semesterSelection(page) {
    try {
        await page.waitForSelector("#semesterSelection3");
        await page.click("#semesterSelection3");
        await page.click("#submit");
    } catch (err) {
        console.log("Semester selection button not found");
        await errorFunc(page);
    }
}

async function errorFunc(page) {
    console.log("There has been an error, trying to fix it.");
    await delay(100000);
    await checkTime(page, timeArray);
    errorCount++;
    if (errorCount == 2) {
        // increase?
        await delay(100000);
        await restartProgram();
    }

    await reloadPage(page);

    await checkForElements(page);
    if ((await page.$("#j_username")) != null) {
        await login(page);
    }

    await checkForElements(page);
    if ((await page.$("#semesterSelection3")) != null) {
        await semesterSelection(page);
    }

    try {
        await page.waitForSelector("#i1", { timeout: 60000 });
    } catch (err) {
        console.log("Could not find input box. Reloading page...");
        await errorFunc(page);
    }

    console.log("Successfully handled error and refreshed page!");

    //maybe reset error count?
    errorCount = 0;
}

async function checkTime(page, timeArray) {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let time = hour * 60 + minute;
    let whenToRestart = timeArray[0] * 60 + timeArray[1]; // restarts program after 8:15 am

    console.log(`It is ${hour}:${minute}:${second}.`);

    if (time <= whenToRestart + 15 && time >= whenToRestart) {
        console.log(`It is ${hour}:${minute}. Restarting program...`);
        await delay(250000);
        await restartProgram();
    }

    if (time <= 6 * 60 + 5 && time >= 1 * 60 + 55) {
        console.log(`It is ${hour}:${minute}. WebReg is down...`);
        let timeout = (6 * 60 + 10 - time) * 60;
        console.log(`Halting program for ${timeout} seconds.`);
        await delay(timeout * 1000);
        await reloadPage(page);
        //relogin = false;
        await semesterSelection(page);
        await bypassLoadingScrn(page);
        console.log("Successfully re-logged in!");
    }
}

module.exports = {
    authenticate,
    semesterSelection,
    login,
    checkTime,
};
