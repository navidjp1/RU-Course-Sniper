const pt = require("puppeteer");

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

async function testLogin(RUID, PAC, idObjects) {
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

async function getUserCurrentCourses(page) {
    await page.waitForSelector(".courses");

    const indexStrings = await page.evaluate(() => {
        // Select all course elements
        const courseElements = document.querySelectorAll(".courses dt span");

        // Map through each course element and extract the index string
        return Array.from(courseElements).map((courseElement) => {
            // Get the inner text of the course element and split it by newline
            const courseText = courseElement.innerText.split("\n");

            // Find the text containing the index string format [XXXXX]
            const indexString = courseText.find(
                (line) => line.includes("[") && line.includes("]")
            );

            console.log(indexString);

            // Extract the index number from the format [XXXXX]
            return indexString.match(/\[(.*?)\]/)[1];
        });
    });

    return indexStrings;
}

async function checkValidDropIDs(idObjects, userCurrentCourses) {
    for (const obj of idObjects) {
        const dropIDArray = obj.drop;
        const valid = dropIDArray.every((id) => userCurrentCourses.includes(id));

        if (!valid) return "Invalid drop IDs";
    }
    return "Success!";
}

module.exports = { testLogin };
