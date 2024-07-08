const { bypassLoadingScrn } = require("./ptHelpers");
const { semesterSelection } = require("./ptLogin");

async function register(page, course_ID) {
    let addAndDrop = true;

    if (course_ID == "07636") {
        addAndDrop = false;
        await add(page, course_ID);
    }

    if (addAndDrop) {
        let which_id = 5;
        let which_course = "10486";

        // if (course_ID == '07589' || course_ID == '07590' || course_ID == '07591' || course_ID == '07592') {
        //     which_id = 1;
        //     which_course = '07609';
        // }

        await drop(page, which_id);

        await add(page, course_ID);

        await add(page, which_course); // attempting to re-add dropped course
    }

    console.log(`Successfully tried to register for ${course_ID}!`);

    // take screenshot of page after trying to register
}

async function drop(page, which_id) {
    try {
        await page.waitForSelector(
            `::-p-xpath(/html/body/div[2]/div[2]/dl[${which_id}]/dt/form/input[2])`
        );

        page.on("dialog", async (dialog) => {
            await dialog.accept();
        });

        await page.click(
            `::-p-xpath(/html/body/div[2]/div[2]/dl[${which_id}]/dt/form/input[2])`
        ); // dl[5] = dropping 5th course on user's WebReg screen

        console.log("Dropped course!");
    } catch (err) {
        console.log("Drop button not found");
        await quickReload(page);
        await drop(page, which_id);
    }

    await bypassLoadingScrn(page);
}

async function add(page, id) {
    try {
        await page.waitForSelector("#i1");
        await page.type("#i1", id, { delay: 100 });
        await page.click("#submit");
    } catch (err) {
        console.log("Add course input not found");
        await quickReload(page);
        await add(page, id);
    }

    await bypassLoadingScrn(page);
}

async function quickReload(page) {
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    await semesterSelection(page);
}

module.exports = { register };
