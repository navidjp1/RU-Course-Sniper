const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

const semesterSelection = "#semesterSelection4";
export const login = async (RUID, PAC, page) => {
    console.log("Attempting to login... -> " + RUID);

    try {
        await page.goto(url);

        await page.waitForSelector("#j_username");
        await page.type("#j_username", RUID, { delay: 100 });

        await page.waitForSelector("#j_password");
        await page.type("#j_password", PAC, { delay: 100 });

        await page.waitForSelector("#submit");
        await page.click("#submit");

        await page.waitForSelector(semesterSelection);
        await page.click(semesterSelection); // change depending on semester

        const submit = await page.waitForSelector("#submit");
        await submit.click();

        await page.waitForSelector(".courses");

        return { status: 200, message: "Successfully logged in!" };
    } catch (error) {
        console.log(error);
        // take screenshot of page
        return { status: 206, message: `Error processing request: ${error.message}` };
    }
};

export const relogin = async (RUID, PAC, page) => {
    const { status, message } = await logout(page);
    if (status != 200) return { status, message };

    return await login(RUID, PAC, page);
};

export const logout = async (page) => {
    try {
        await page.waitForSelector("#logout a");
        await page.click("#logout a");

        await page.goto(url);
        return { status: 200, message: "Successfully logged in!" };
    } catch (err) {
        console.log("Error logging out ", error);

        return { status: 206, message: `Error processing request: ${error.message}` };
    }
};
