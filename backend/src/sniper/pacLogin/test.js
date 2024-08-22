import pt from "puppeteer";

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

const RUID = "222001450";
const PAC = "0321";
const dropIDs = ["10285"];
async function testLogin() {
    console.log("Testing login credentials...");
    const browser = await pt.launch({ headless: false });

    try {
        let page = await browser.newPage();

        await page.goto(url);

        const usernameInput = await page.waitForSelector("#j_username");
        await usernameInput.type(RUID, { delay: 100 });

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
        const userCurrentCourses = await traverseUserCurrentCourses(page);

        console.log(userCurrentCourses);

        await browser.close();
    } catch (err) {
        // To do: provide more accurate error
        await browser.close();
        return "Puppeteer error: " + err;
    }
}

// testLogin();
