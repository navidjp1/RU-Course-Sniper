import pt from "puppeteer";

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

const semesterSelection = "#semesterSelection4";

export async function testLogin(RUID, PAC, idObjects) {
    console.log("Testing login credentials for " + RUID + " ...");
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

        await page.waitForSelector(`.errors, ${semesterSelection}`);

        if ((await page.$(".errors")) != null) {
            await browser.close();
            return "Invalid login credentials";
        }
        await page.waitForSelector(semesterSelection);
        await page.click(semesterSelection);

        const submit = await page.waitForSelector("#submit");
        await submit.click();

        await page.waitForSelector(".courses");

        let msg = "Success";

        const includesDropIDs = idObjects.some((obj) => obj.drop.length > 0);
        if (includesDropIDs) {
            console.log(`Validating drop IDs for ${RUID}...`);
            const userCurrentCourses = await getUserCurrentCourses(page);
            msg = await checkValidDropIDs(idObjects, userCurrentCourses);
        }

        await browser.close();
        return msg;
    } catch (err) {
        // To do: provide more accurate error
        await browser.close();
        return "Puppeteer error: " + err;
    }
}

async function getUserCurrentCourses(page) {
    const indexStrings = await page.evaluate(() => {
        const courseElements = document.querySelectorAll(".courses dt span");

        console.log(courseElements);

        return Array.from(courseElements).map((courseElement) => {
            const courseText = courseElement.innerText.split("\n");

            const indexString = courseText.find(
                (line) => line.includes("[") && line.includes("]")
            );

            const index = indexString.match(/\[(.*?)\]/)[1];

            return index;
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

    return "Success";
}
