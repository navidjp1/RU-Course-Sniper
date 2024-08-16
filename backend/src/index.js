require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userModel = require("./models/User");
const courseModel = require("./models/CourseData");
const { testLogin } = require("./sniper_paclogin/testLogin");
const { runSniper } = require("./sniper_paclogin/sniperPAC");

const app = express();
app.use(express.json());
app.use(cors());

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database");
    } catch (error) {
        console.log(`There was an error connecting to the database: ${error}`);
    }
})();

app.post("/api/get_courses", async (req, res) => {
    try {
        const { username } = req.body;
        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const idObjects = user.courseIDs;

        const courseDetails = await Promise.all(
            idObjects.map(async (obj) => {
                const id = obj.add;
                const dropIDs = obj.drop.length === 0 ? null : obj.drop.join(", ");
                const idData = await courseModel.findOne({ index: id });
                if (idData) {
                    const section = idData.section;
                    const title = idData.name;

                    return { id, section, title, dropIDs };
                } else {
                    return { id, section: null, title: null, dropIDs };
                }
            })
        );
        res.json(courseDetails);
    } catch (err) {
        console.log(`Error fetching course data: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
});

app.post("/api/check_course", async (req, res) => {
    const { courseID } = req.body;

    courseModel
        .findOne({ index: courseID })
        .then(async (id) => {
            if (!id) {
                res.json("Course not in DB");
            } else {
                res.json("Success");
            }
        })
        .catch((err) => {
            res.json(`Error checking course ${err}`);
        });
});

app.post("/api/add", async (req, res) => {
    const { username, courseID, dropIDs } = req.body;

    userModel
        .findOne({ username: username })
        .then(async (user) => {
            const idObjects = user.courseIDs;
            const found = idObjects.some((obj) => obj.add === courseID);
            if (found) {
                res.json("Duplicate");
                return;
            }
            idObjects.push({ add: courseID, drop: dropIDs });
            user.testedLogin = false;
            await user.save();
            res.json("Success");
        })
        .catch((err) => {
            res.json(`Error adding course ${err}`);
        });
});

app.post("/api/delete", async (req, res) => {
    const { username, courseID } = req.body;

    try {
        const result = await userModel.updateOne(
            { username: username },
            { $pull: { courseIDs: { add: courseID.id } } }
        );
        res.json("Success");
    } catch (err) {
        console.error("Error removing courseID:", err);
        res.json(`Error deleting course ${err}`);
    }

    // userModel
    //     .findOne({ username: username })
    //     .then(async (user) => {
    //         let idObjects = user.courseIDs;
    //         const removedID = idObjects.filter((obj) => obj.add !== courseID.id);
    //         console.log(removedID);
    //         user.courseIDs = removedID;
    //         await user.save();
    //         res.json("Success");
    //     })
    //     .catch((err) => {
    //         res.json(`Error deleting course ${err}`);
    //     });
});

app.post("/api/get_data", async (req, res) => {
    const { username } = req.body;

    userModel
        .findOne({ username: username })
        .then(async (user) => {
            const RUID = user.RUID;
            const PAC = user.PAC;
            res.json({ RUID, PAC });
        })
        .catch((err) => {
            res.json(`Error fetching user data ${err}`);
        });
});

app.post("/api/start_sniper", async (req, res) => {
    const { username } = req.body;

    userModel
        .findOne({ username: username })
        .then(async (user) => {
            const RUID = user.RUID;
            const PAC = user.PAC;
            const testedLogin = user.testedLogin;
            const idObjects = user.courseIDs;
            if (RUID === "" || PAC === "") {
                res.json("No cred");
            } else if (!testedLogin) {
                const msg = await testLogin(RUID, PAC, idObjects);
                if (msg != "Success") {
                    res.json(msg);
                    return;
                }
                user.testedLogin = true;
                await user.save();
            }

            const restartTime = user.restartTime.split(":").map(Number);

            runSniper(RUID, PAC, idObjects, restartTime, true);
            res.json("Success");
        })
        .catch((err) => {
            res.json(`Error fetching user data ${err}`);
        });
});

app.post("/api/stop_sniper", async (req, res) => {
    const success = await runSniper("", "", [], [], false);
    success ? res.json("Success") : res.json("Error");
});

app.post("/settings", async (req, res) => {
    const {
        currentUsername,
        newUsername,
        newEmail,
        currentPassword,
        newPassword,
        preferences,
        newTime,
        RUID,
        PAC,
    } = req.body;

    userModel
        .findOne({ username: currentUsername })
        .then(async (user) => {
            if (user.password != currentPassword) {
                res.json("Incorrect password");
                return;
            }

            if (newUsername != "") {
                user.username = newUsername;
            }
            if (newEmail != "") {
                user.email = newEmail;
            }
            if (newPassword != "") {
                user.password = newPassword;
            }

            if (RUID != "") {
                user.RUID = RUID;
                user.testLogin = false;
            }

            if (PAC != "") {
                user.PAC = PAC;
                user.testLogin = false;
            }

            const currPref = user.preferences;

            if (currPref.emailNotifications != preferences.emailNotifications) {
                user.preferences.emailNotifications = preferences.emailNotifications;
            }

            if (currPref.smsNotifications != preferences.smsNotifications) {
                user.preferences.smsNotifications = preferences.smsNotifications;
            }

            if (newTime != user.restartTime) {
                user.restartTime = newTime;
            }

            await user.save();
            res.json("Success");
        })
        .catch((err) => {
            res.json(`Error updating settings: ${err}`);
        });
});

app.post("/api/check_username", async (req, res) => {
    const { username } = req.body;
    const user = await userModel.findOne({ username: username });
    if (user != null) {
        res.json("Duplicate username");
    } else {
        res.json("Success");
    }
});

app.post("/api/register_user_data", async (req, res) => {
    await userModel
        .create(req.body)
        .then(() => res.json("Success"))
        .catch((err) => res.json(err));
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
