import pt from "puppeteer";
import axios from "axios";

const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

async function login(page) {
    console.log("Attempting to login...");

    try {
        await page.goto(url);

        await page.waitForSelector("#j_username");
        await page.type("#j_username", "222001450", { delay: 100 });

        await page.waitForSelector("#j_password");
        await page.type("#j_password", "0321", { delay: 100 });

        await page.waitForSelector("#submit");
        await page.click("#submit");

        await page.waitForSelector("#semesterSelection3");
        await page.click("#semesterSelection3");

        const submit = await page.waitForSelector("#submit");
        await submit.click();

        await page.waitForSelector(".courses");

        console.log("Successfully logged in!");
    } catch (error) {
        console.log("Error logging in: " + error);
    }
}

async function runPagesWithContext() {
    console.log("Starting browser...");
    const browser = await pt.launch({ headless: false });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const context = await browser.createBrowserContext();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    let page = await context.newPage();
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page.goto(url);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await login(page);
    await new Promise((resolve) => setTimeout(resolve, 4000));

    await page.close();
    console.log("Closed page 1...");
    await new Promise((resolve) => setTimeout(resolve, 4000));

    await browser.close();
    console.log("Program halted.");
}

async function runPagesWithoutContext() {
    console.log("Starting browser...");
    const browser = await pt.launch({ headless: false });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const page1 = await browser.newPage();
    console.log("Opened page 1...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page1.goto(url);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await login(page1);
    await new Promise((resolve) => setTimeout(resolve, 4000));

    await page1.close();
    console.log("Closed page 1...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const page2 = await browser.newPage();
    console.log("Opened page 2...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page2.goto(url);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await login(page2);
    await new Promise((resolve) => setTimeout(resolve, 4000));

    await page2.close();
    console.log("Closed page 2...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await browser.close();
    console.log("Program halted.");
}

await runPagesWithContext();
await new Promise((resolve) => setTimeout(resolve, 4000));
// await runPagesWithoutContext();

// test different scenarios
