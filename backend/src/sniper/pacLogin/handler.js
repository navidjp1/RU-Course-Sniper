// import "dotenv/config";
// import pt from "puppeteer";
// import userModel from "../../models/User.js";
// import { delay } from "../../utils.js";
// import { login, relogin } from "./login.js";
// import { register } from "./snipe.js";
// import { updateUserPositions } from "../../controllers/courses.js";
// import { getCachedCourses } from "../../proxy/proxyHandler.js";

// const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

// class puppeteerManager {
//     constructor() {
//         this.isRunning = false;
//         this.shouldRestart = false;
//         this.requestCount = 0;
//         this.errorCount = 0;
//         this.restartCount = 0;
//         this.ids = [];
//     }

//     async sendRequest(uid) {
//         try {
//             const response = await getCachedCourses();
//             if (response.error) {
//                 throw new Error(response.error);
//             }
//             this.ids.forEach(async (idObj) => {
//                 const id = idObj.add;
//                 if (response.includes(id)) {
//                     console.log(`Course index: ${id} was found!`);
//                     // const { status, message } = await register(idObj);
//                     // if (status == 200) {
//                     //     await this.handleAfterRegister(uid, id);
//                     //     return true;
//                     // }
//                     // console.log(message);
//                 }
//             });
//         } catch (error) {
//             console.error(`Error fetching open courses: ${error}`);
//         }

//         this.requestCount++;
//         return false;
//     }

//     async handleAfterRegister(uid, courseId) {
//         try {
//             const user = await userModel.findOne({ uid });
//             const idObjects = user.courseIDs;
//             const idObj = idObjects.find((obj) => obj.add === courseId);
//             const oldPosition = idObj.position;
//             idObj.status = "REGISTERED";
//             idObj.position = -1;
//             await user.save();
//             this.ids = this.ids.filter((obj) => obj.add !== courseId);

//             await updateUserPositions(courseId, oldPosition);
//         } catch (error) {
//             console.error(
//                 `Could not update course status for courseId ${courseId}: ${error}`
//             );
//         }
//     }

//     async handleSniper(shouldRun, RUID, PAC, idObjects, uid) {
//         if (shouldRun && !this.isRunning) {
//             this.isRunning = true;

//             console.log("Starting sniper browser for RUID: " + RUID);
//             // const browser = await pt.launch();
//             const browser = await pt.launch({
//                 executablePath:
//                     process.env.NODE_ENV === "production"
//                         ? process.env.PUPPETEER_EXECUTABLE_PATH
//                         : pt.executablePath(),
//             });

//             const context = await browser.createBrowserContext();
//             const page = await context.newPage();
//             await page.setDefaultTimeout(15000);

//             const { status, message } = await login(RUID, PAC, page);
//             if (status != 200)
//                 await this.errorHandler(message, RUID, PAC, uid, page, context);

//             this.ids = idObjects;

//             while (this.isRunning == true) {
//                 const registered = await this.sendRequest(uid);

//                 if (registered) {
//                     page.setDefaultTimeout(5000);
//                     this.shouldRestart = true;
//                     this.isRunning = false;
//                     this.restartCount = ids.length === 0 ? 5 : restartCount - 1;
//                 } else {
//                     if (this.requestCount % 10 == 0) {
//                         console.log(
//                             `${this.requestCount} iterations completed. RUID: ${RUID}`
//                         );
//                         if (this.requestCount % 200 == 0) {
//                             await this.checkTime();
//                             const { status, message } = await relogin(RUID, PAC, page);
//                             if (status != 200)
//                                 await this.errorHandler(
//                                     message,
//                                     RUID,
//                                     PAC,
//                                     uid,
//                                     page,
//                                     context
//                                 );
//                         }
//                     }
//                 }
//                 await delay(4000);
//             }

//             this.requestCount = 0;

//             console.log("Closing browser... -> " + RUID);
//             await browser.close();
//         } else {
//             this.isRunning = false;
//             console.log("Auto-sniper stopped. -> " + RUID);
//         }

//         if (this.shouldRestart && this.restartCount < 3) {
//             console.log("Auto-sniper restarting... -> " + RUID);
//             console.log(`Restart count: ${restartCount}`);
//             this.isRunning = false;
//             this.shouldRestart = false;
//             this.errorCount = 0;
//             this.requestCount = 0;
//             this.restartCount += 1;
//             await delay(30000);
//             await this.handleSniper(true, RUID, PAC, ids);
//         }

//         console.log(`Program halted for ${RUID}.\n`);
//         return true;
//     }

//     async errorHandler(message, RUID, PAC, uid, page, context) {
//         if (!this.isRunning && this.shouldRestart) return;

//         this.errorCount++;
//         console.log(`Error #${this.errorCount}: ${message}`);

//         if (this.errorCount <= 2) {
//             // open new page
//             await page.close();
//             page = await context.newPage();
//             await page.setDefaultTimeout(15000);
//             const { status, message } = await login(RUID, PAC, page);
//             if (status == 200) {
//                 this.errorCount = 0;
//                 return;
//             }
//         }
//         page.setDefaultTimeout(5000);

//         this.shouldRestart = true;
//         this.isRunning = false;
//     }

//     async checkTime() {
//         let date = new Date();
//         let hour = date.getHours();
//         let minute = date.getMinutes();
//         let second = date.getSeconds();
//         let time = hour * 60 + minute;

//         console.log(`It is ${hour}:${minute}:${second} UTC.`);

//         const downtimeStart = 6 * 60 + 55;
//         const downtimeEnd = 11 * 60 + 5;

//         // const downtimeStart = 1 * 60 + 55;
//         // const downtimeEnd = 6 * 60 + 5;

//         if (time <= downtimeEnd && time >= downtimeStart) {
//             console.log(`It is ${hour}:${minute} UTC. WebReg is down...`);
//             let timeout = (downtimeEnd - time) * 60;
//             console.log(`Halting program for ${timeout} seconds.`);
//             await delay(timeout * 1000);

//             // check whether large delay causes any issues
//         }
//     }
// }

// export default puppeteerManager;

// --------------------------------------------------------------------

// import "dotenv/config";
// import pt from "puppeteer";
// import userModel from "../../models/User.js";
// import { delay } from "../../utils.js";
// import { login, relogin } from "./login.js";
// import { register } from "./snipe.js";
// import { updateUserPositions } from "../../controllers/courses.js";
// import { getCachedCourses } from "../../proxy/proxyHandler.js";

// const url = "https://sims.rutgers.edu/webreg/pacLogin.htm";

// let requestCount = 0;
// let errorCount = 0;
// let restartCount = 0;

// let ids = [];

// const userIsRunning = new Map();
// const userShouldRestart = new Map();

// async function sendRequest(uid) {
//     try {
//         const response = await getCachedCourses();
//         if (response.error) {
//             throw new Error(response.error);
//         }
//         ids.forEach(async (idObj) => {
//             const id = idObj.add;
//             if (response.includes(id)) {
//                 console.log(`Course index: ${id} was found!`);
//                 // const { status, message } = await register(idObj);
//                 // if (status == 200) {
//                 //     await handleAfterRegister(uid, id);
//                 //     return true;
//                 // }
//                 // console.log(message);
//             }
//         });
//     } catch (error) {
//         console.error(`Error fetching open courses: ${error}`);
//     }

//     requestCount++;
//     return false;
// }

// async function handleAfterRegister(uid, id) {
//     try {
//         const user = await userModel.findOne({ uid });
//         const idObjects = user.courseIDs;
//         const id = idObjects.find((obj) => obj.add === id);
//         const oldPosition = id.position;
//         id.status = "REGISTERED";
//         id.position = -1;
//         await user.save();
//         ids = ids.filter((obj) => obj.add !== id);

//         await updateUserPositions(id, oldPosition);
//     } catch (error) {
//         console.error(`Could not update course status for id ${id}: ${error}`);
//     }
// }

// export const handleSniper = async (shouldRun, RUID, PAC, idObjects, uid) => {
//     const isRunning = userIsRunning.get(uid) || false;
//     const shouldRestart = userShouldRestart.get(uid) || false;

//     if (shouldRun && !isRunning) {
//         userIsRunning.set(uid, true);

//         console.log("Starting sniper browser for RUID: " + RUID);
//         // const browser = await pt.launch();
//         const browser = await pt.launch({
//             executablePath:
//                 process.env.NODE_ENV === "production"
//                     ? process.env.PUPPETEER_EXECUTABLE_PATH
//                     : pt.executablePath(),
//         });

//         const context = await browser.createBrowserContext();
//         const page = await context.newPage();
//         await page.setDefaultTimeout(15000);

//         const { status, message } = await login(RUID, PAC, page);
//         if (status != 200) await errorHandler(message, RUID, PAC, uid, page, context);

//         ids = idObjects;

//         while (userIsRunning.get(uid) == true) {
//             const registered = await sendRequest(uid);

//             if (registered) {
//                 page.setDefaultTimeout(5000);
//                 userShouldRestart.set(uid, true);
//                 userIsRunning.set(uid, false);
//                 restartCount = ids.length === 0 ? 5 : restartCount - 1;
//             } else {
//                 if (requestCount % 10 == 0) {
//                     console.log(`${requestCount} iterations completed. RUID: ${RUID}`);
//                     if (requestCount % 200 == 0) {
//                         await checkTime();
//                         const { status, message } = await relogin(RUID, PAC, page);
//                         if (status != 200)
//                             await errorHandler(message, RUID, PAC, uid, page, context);
//                     }
//                 }
//             }
//             await delay(4000);
//         }

//         requestCount = 0;

//         console.log("Closing browser... -> " + RUID);
//         await browser.close();
//     } else {
//         userIsRunning.set(uid, false);
//         console.log("Auto-sniper stopped. -> " + RUID);
//     }

//     if (shouldRestart && restartCount < 3) {
//         console.log("Auto-sniper restarting... -> " + RUID);
//         console.log(`Restart count: ${restartCount}`);
//         userIsRunning.set(uid, false);
//         userShouldRestart.set(uid, false);
//         errorCount = 0;
//         requestCount = 0;
//         restartCount += 1;
//         await delay(30000);
//         await handleSniper(true, RUID, PAC, ids);
//     }

//     userIsRunning.delete(uid);
//     userShouldRestart.delete(uid);
//     console.log(`Program halted for ${RUID}.\n`);
//     return true;
// };

// async function checkTime() {
//     let date = new Date();
//     let hour = date.getHours();
//     let minute = date.getMinutes();
//     let second = date.getSeconds();
//     let time = hour * 60 + minute;

//     console.log(`It is ${hour}:${minute}:${second} UTC.`);

//     const downtimeStart = 6 * 60 + 55;
//     const downtimeEnd = 11 * 60 + 5;

//     // const downtimeStart = 1 * 60 + 55;
//     // const downtimeEnd = 6 * 60 + 5;

//     if (time <= downtimeEnd && time >= downtimeStart) {
//         console.log(`It is ${hour}:${minute} UTC. WebReg is down...`);
//         let timeout = (downtimeEnd - time) * 60;
//         console.log(`Halting program for ${timeout} seconds.`);
//         await delay(timeout * 1000);

//         // check whether large delay causes any issues
//     }
// }

// async function errorHandler(message, RUID, PAC, uid, page, context) {
//     const isRunning = userIsRunning.get(uid) || false;
//     const shouldRestart = userShouldRestart.get(uid) || false;

//     if (!isRunning && shouldRestart) return;

//     errorCount++;
//     console.log(`Error #${errorCount}: ${message}`);

//     if (errorCount <= 2) {
//         // open new page
//         await page.close();
//         page = await context.newPage();
//         await page.setDefaultTimeout(15000);
//         const { status, message } = await login(RUID, PAC, page);
//         if (status == 200) {
//             errorCount = 0;
//             return;
//         }
//     }
//     page.setDefaultTimeout(5000);

//     userShouldRestart.set(uid, true);
//     userIsRunning.set(uid, false);
// }
