const pt = require("puppeteer");
var axios = require("axios").default;
const User = require("../models/User");
const { register } = require("./ptRegister");
const { authenticate, checkTime } = require("./ptLogin");

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";
// let username = "";
// let password = "";

let requestCount = 0;
let isRunning = false;

async function sendRequest(ids, page) {
    axios
        .request({
            method: "GET",
            url: "https://classes.rutgers.edu/soc/api/openSections.json",
            params: { year: "2024", term: "9", campus: "NB" },
        })
        .then(function (response) {
            ids.forEach(async (id) => {
                if (response.data.includes(id)) {
                    await register(page, id);
                }
            });
        })
        .catch(function (error) {
            console.error("ERROR");
        });

    requestCount++;
}

async function runSniper(RUID, PAC, restartTime, shouldRun) {
    if (shouldRun && !isRunning) {
        isRunning = true;

        const username = RUID;
        const password = PAC;
        const timeArray = restartTime.split(":").map(Number);

        console.log("Launching browser...");
        const browser = await pt.launch({ headless: false });
        let page = await browser.newPage();
        await page.goto(url);
        await authenticate(page, false, username, password, timeArray);

        while (isRunning) {
            await sendRequest(ids, page);

            if (requestCount % 10 == 0) {
                console.log(`${requestCount} iterations completed.`);
                if (requestCount % 200 == 0) {
                    await checkTime(page, timeArray);
                    await authenticate(
                        page,
                        true,
                        username,
                        password,
                        timeArray
                    );
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
}

module.exports = { runSniper };
