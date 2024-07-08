const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

// restart or just close browser?
async function restartProgram() {
    console.log("Restarting sniper.... This is pid " + process.pid);

    // setTimeout(function () {
    //     process.on("exit", function () {
    //         require("child_process").spawn(process.argv.shift(), process.argv, {
    //             cwd: process.cwd(),
    //             detached: true,
    //             stdio: "inherit",
    //         });
    //     });
    //     process.exit();
    // }, 5000);
}

async function reloadPage(page) {
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    await delay(5000);
    await page.goto(url);
    await delay(10000);
}

async function checkForElements(page) {
    try {
        await page.waitForSelector("#j_username, #semesterSelection3", {
            timeout: 60000,
        });
    } catch (err) {
        console.log("Cannot find any elements on the page.");
        await errorFunc(page);
    }
}

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}

async function bypassLoadingScrn(page) {
    try {
        await page.waitForSelector(".spField, #i1");
    } catch (err) {
        console.log("Could not find input box. Reloading page...");
        await quickReload(page);
    }

    if ((await page.$("#i1")) == null) {
        await quickReload(page);
    }
}

module.exports = {
    delay,
    checkForElements,
    reloadPage,
    restartProgram,
    bypassLoadingScrn,
};
