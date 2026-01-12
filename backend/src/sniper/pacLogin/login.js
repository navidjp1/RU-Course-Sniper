import { URL, getSemesterSelector } from "./const.js";

export const login = async (RUID, PAC, page) => {
    console.log("Attempting to login... -> " + RUID);

    try {
        await page.goto(URL);

        await page.waitForSelector("#j_username");
        await page.type("#j_username", RUID, { delay: 100 });

        await page.waitForSelector("#j_password");
        await page.type("#j_password", PAC, { delay: 100 });

        await page.waitForSelector("#submit");
        await page.click("#submit");

        await page.waitForSelector(".semesterInputClass");

        const SEMESTER_SELECTION = await getSemesterSelector(page);

        await page.waitForSelector(SEMESTER_SELECTION);
        await page.click(SEMESTER_SELECTION);

        const submit = await page.waitForSelector("#submit");
        await submit.click();

        await page.waitForSelector(".courses");

        console.log(`${RUID} logged in successfully!`);

        return { status: 200, message: "Successfully logged in!" };
    } catch (error) {
        console.log(error);
        // take screenshot of page
        return { status: 500, message: `Error processing request: ${error.message}` };
    }
};

export const relogin = async (RUID, PAC, page) => {
    console.log("Attempting to logout and relogin... -> " + RUID);
    const { status, message } = await logout(page);
    if (status != 200) return { status, message };

    return await login(RUID, PAC, page);
};

export const logout = async (page) => {
    try {
        await page.waitForSelector("#logout a");
        await page.click("#logout a");

        await page.goto(URL);
        return { status: 200, message: "Successfully logged out!" };
    } catch (error) {
        console.log("Error logging out -> " + error);

        return { status: 500, message: `Error processing request: ${error.message}` };
    }
};
