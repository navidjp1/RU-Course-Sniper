const pt = require("puppeteer");

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

async function testLogin(RUID, PAC) {
    console.log("Testing login credentials...");
    const browser = await pt.launch({ headless: true });

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
        await browser.close();

        return "Success";
    } catch (err) {
        // To do: provide more accurate error
        await browser.close();
        return "Puppeteer error: " + err;
    }
}

module.exports = { testLogin };
