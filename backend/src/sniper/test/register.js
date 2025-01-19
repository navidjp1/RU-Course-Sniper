import pt from "puppeteer";
import { delay } from "../../utils.js";

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

const semesterSelection = "#semesterSelection4";

let browser = null;

export async function register() {
    const RUID = "222001450";
    const PAC = "0321";

    // closed course (causes .spField to be visible)
    // message: "13514 - There are no open sections for this course."
    // const id = "13514";

    // course that conflicts with existing schedule (.error)
    // message: "The section you requested cannot be added because it meets at the same time as another course already on your schedule: 10751"
    // const id = "10747";

    // invalid course id (.error)
    // message: "An invalid index number 87232 was entered. Please enter a valid index number."
    // const id = "87232";

    // go over 18 credits (.error)
    // message: "Adding this course will take you over the maximum credits allowed. Drop a course or contact your academic deans office for permission to take an overload."
    // const id = "10747";

    // have not taken prereqs (.error)
    // message: "You are not eligible to take this course because you do not meet the placement requirement or have the prerequisite."
    // const id = "10770"

    // major not declared yet (.error)
    // message: "You cannot add this course. Please refer to the Schedule of Classes for course restrictions."
    // const id = "10770"

    // already registered (.error)
    // message: "You are already registered for course 10745. Please refresh your schedule if the course is not currently displayed."
    // const id = "10745";

    // valid course id (.ok)
    // message: 1 course(s) added successfully.
    // const id = "10745";

    // website not loading (cannot be prevented)
    // html tag --> id = "wait"

    // dropping:
    // valid course id (.ok)
    // message: "Course successfully dropped."

    try {
        browser = await pt.launch({
            headless: false,
            executablePath:
                process.env.NODE_ENV === "production"
                    ? process.env.PUPPETEER_EXECUTABLE_PATH
                    : pt.executablePath(),
        });
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
            console.log("Login failed for RUID: " + RUID);
            await browser.close();
            return "Invalid login credentials";
        }
        await page.waitForSelector(semesterSelection);
        await page.click(semesterSelection);

        const submit = await page.waitForSelector("#submit");
        await submit.click();

        await page.waitForSelector(".courses, .errors");

        if ((await page.$(".errors")) != null) {
            const errorMessage = await page.$eval(".errors h2 span", (element) =>
                element.textContent.trim()
            );
            await browser.close();
            console.log(errorMessage);
        }

        await page.waitForSelector("#i1");
        await page.type("#i1", id, { delay: 100 });
        await page.waitForSelector("#submit");
        await page.click("#submit");
        await page.waitForSelector(".spField, .error, .ok", { timeout: 120000 });

        let message = "";

        if ((await page.$(".spField")) != null) {
            const openSectionsText = await page.$eval(
                "#actionRequestHolder .first",
                (element) => element.textContent.trim()
            );
            message = openSectionsText;
        }

        if ((await page.$(".error")) != null) {
            const errorText = await page.$eval(".error", (element) =>
                element.textContent.trim()
            );
            message = errorText;
        }

        if ((await page.$(".ok")) != null) {
            const okText = await page.$eval(".ok", (element) =>
                element.textContent.trim()
            );
            message = okText;
        }

        console.log(message);

        await delay(15000);

        console.log("Closing browser for RUID: " + RUID);
        await browser.close();
    } catch (err) {
        // To do: provide more accurate error

        console.log("Puppeteer error: " + err);
        await browser.close();
        return "Puppeteer error: " + err;
    }
}

register();
