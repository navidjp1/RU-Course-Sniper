import { getUserCurrentCourses } from "./utils.js";
import pt from "puppeteer";

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

export async function testLogin(RUID, PAC, idObjects) {
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
        await page.click("#semesterSelection3");

        const submit = await page.waitForSelector("#submit");
        await submit.click();

        await page.waitForSelector(".courses");
        const userCurrentCourses = await getUserCurrentCourses(page);
        const msg = await checkValidDropIDs(idObjects, userCurrentCourses);

        await browser.close();

        return msg;
    } catch (err) {
        // To do: provide more accurate error
        await browser.close();
        return "Puppeteer error: " + err;
    }
}

async function checkValidDropIDs(idObjects, userCurrentCourses) {
    for (const obj of idObjects) {
        const dropIDArray = obj.drop;
        const valid = dropIDArray.every((id) => userCurrentCourses.includes(id));

        if (!valid) return "Invalid drop IDs";
    }
    return "Success";
}
