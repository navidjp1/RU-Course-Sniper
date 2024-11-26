import { delay } from "../../utils.js";

export async function register(idObject, page) {
    try {
        const addID = idObject.add;

        await page.waitForSelector("#i1");
        await page.type("#i1", addID, { delay: 100 });
        await page.waitForSelector("#submit");
        await page.click("#submit");
        await page.waitForSelector(".spField, .error, .ok", { timeout: 120000 });

        let message = "";
        let status = 500;

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
            status = 200;
        }

        await delay(5000);

        return { status, message };
    } catch (error) {
        console.log(error);
        return { status: 500, message: `Error processing request: ${error.message}` };
    }
}

// export async function register(idObject) {
//     const addID = idObject.add;
//     const dropIDArray = idObject.drop;

//     let message = "";
//     let status = 200;

//     if (dropIDArray.length === 0) {
//         const success = await add(addID);
//         console.log(`Tried to add ${addID} successfully? ${success}`);
//         if (!success) return { status: 500, message: "Could not add course" };
//     } else {
//         for (const dropID of dropIDArray) {
//             const dropIDNumber = userCurrentCourses.indexOf(dropID) + 1;
//             if (dropIDNumber === -1) {
//                 continue;
//             }
//             const success = await drop(dropIDNumber);
//             if (!success) {
//                 status = 500;
//                 message += `Could not drop course ${dropID}\n`;
//             }
//         }
//         const success = await add(addID);
//         if (!success) {
//             status = 500;
//             message += `Could not add wanted course: ${addID}\n`;
//         }

//         // if course not successfully added, re-add dropped courses
//         for (const dropID of dropIDArray) {
//             const success = await add(dropID);
//             if (!success) {
//                 status = 500;
//                 message += `Could not re add dropped course: ${dropID}\n`;
//             }
//         }
//     }

//     // take screenshot of page after trying to register
//     return { status, message };
// }

// async function drop(idNum) {
//     try {
//         await page.waitForSelector(
//             `::-p-xpath(/html/body/div[2]/div[2]/dl[${idNum}]/dt/form/input[2])`
//         );

//         page.on("dialog", async (dialog) => {
//             await dialog.accept();
//         });

//         await page.click(
//             `::-p-xpath(/html/body/div[2]/div[2]/dl[${idNum}]/dt/form/input[2])`
//         ); // dl[5] = dropping 5th course on user's WebReg screen

//         await page.waitForSelector(".spField, #i1", { timeout: 60000 });

//         return true;
//     } catch (err) {
//         console.log("Could not drop course: ", err);
//         return false;
//     }
// }

// async function add(id) {
//     try {
//         await page.waitForSelector("#i1");
//         await page.type("#i1", id, { delay: 100 });
//         await page.click("#submit");
//         await page.waitForSelector(".spField, #i1", { timeout: 60000 });
//         return true;
//     } catch (err) {
//         console.log("Could not add course: ", err);
//         return false;
//     }
// }

// ---------------------------------------------

// error handling for sniping

// async function quickReload(page) {
//     try {
//         await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
//         await page.waitForSelector(".courses, #semesterSelection3");

//         if ((await page.$("#semesterSelection3")) != null) {
//             await page.waitForSelector("#semesterSelection3");
//             await page.click("#semesterSelection3");
//             await page.click("#submit");
//         }

//         await page.waitForSelector(".courses");

//         return { success: true };
//     } catch (error) {
//         console.log(error);
//         return { success: 500 };
//     }
// }
