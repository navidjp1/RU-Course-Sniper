const { getUserCurrentCourses } = require("./utils");
const pt = require("puppeteer");

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

async function verifyCreds(RUID, PAC) {
    console.log("Testing login credentials...");
    const browser = await pt.launch({ headless: false });

    try {
        let page = await browser.newPage();

        await page.goto(url);

        await page.waitForSelector("#j_username");
        await page.type("#j_username", RUID, { delay: 100 });

        await page.waitForSelector("#j_password");
        await page.type("#j_password", PAC, { delay: 100 });

        await page.waitForSelector("#submit");
        await page.click("#submit");

        await page.waitForSelector(".errors, #semesterSelection3");

        if ((await page.$(".errors")) != null) {
            await browser.close();
            return "Invalid login credentials";
        }
        await page.waitForSelector("#semesterSelection3");
        await page.click("#semesterSelection3");

        const submit = await page.waitForSelector("#submit");
        await submit.click();

        await page.waitForSelector(".courses");
        const userCurrentCourses = await getUserCurrentCourses(page);

        await browser.close();

        return userCurrentCourses;
    } catch (err) {
        // To do: provide more accurate error
        await browser.close();
        console.error("Puppeteer error: " + err);
        return null;
    }
}

module.exports = { verifyCreds };
