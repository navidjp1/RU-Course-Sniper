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

app.post("/", async (req, res) => {
    const { username, password } = req.body;
    userModel.findOne({ username: username }).then((user) => {
        if (user) {
            if (user.password === password) {
                res.json("Success");
            } else {
                res.json("Password is incorrect");
            }
        } else {
            res.json("Username not found.");
        }
    });
});

app.post("/api/get_courses", async (req, res) => {
    try {
        const { username } = req.body;
        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const ids = user.courseIDs;

        const courseDetails = await Promise.all(
            ids.map(async (id) => {
                const idData = await courseModel.findOne({ index: id });
                if (idData) {
                    const section = idData.section;
                    const title = idData.name;
                    return { id, section, title };
                } else {
                    return { id, section: null, title: null };
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

app.post("/api/add", async (req, res) => {
    const { username, courseID } = req.body;

    userModel
        .findOne({ username: username })
        .then(async (user) => {
            const ids = user.courseIDs;
            if (ids.indexOf(courseID) != -1) {
                res.json("Duplicate");
                return;
            }
            ids.push(courseID);
            await user.save();
            res.json("Success");
        })
        .catch((err) => {
            res.json(`Error adding course ${err}`);
        });
});

app.post("/api/delete", async (req, res) => {
    const { username, courseID } = req.body;

    userModel
        .findOne({ username: username })
        .then(async (user) => {
            let ids = user.courseIDs;
            const index = ids.indexOf(courseID.id);
            if (index > -1) {
                ids.splice(index, 1);
            }
            user.courseIDs = ids;
            await user.save();
            res.json("Success");
        })
        .catch((err) => {
            res.json(`Error deleting course ${err}`);
        });
});

app.post("/api/get_data", async (req, res) => {
    const { username } = req.body;

    userModel
        .findOne({ username: username })
        .then(async (user) => {
            const preferences = user.preferences;
            const restartTime = user.restartTime;
            const RUID = user.RUID;
            const PAC = user.PAC;
            res.json({ preferences, restartTime, RUID, PAC });
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
            if (RUID === "" || PAC === "") {
                res.json("No cred");
            } else if (!testedLogin) {
                const msg = await testLogin(RUID, PAC);
                if (msg != "Success") {
                    res.json(msg);
                    return;
                }
                user.testedLogin = true;
                await user.save();
            }

            const courseIDs = user.courseIDs;
            const restartTime = user.restartTime.split(":").map(Number);

            runSniper(RUID, PAC, courseIDs, restartTime, true);
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
                localStorage.setItem("username", newUsername);
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
                user.preferences.emailNotifications =
                    preferences.emailNotifications;
            }

            if (currPref.smsNotifications != preferences.smsNotifications) {
                user.preferences.smsNotifications =
                    preferences.smsNotifications;
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

app.post("/signup", async (req, res) => {
    const { username, email } = req.body;
    const user = await userModel.findOne({ username: username });
    const mail = await userModel.findOne({ email: email });
    if (mail != null) {
        res.json("Duplicate email");
        return;
    }
    if (user != null) {
        res.json("Duplicate username");
        return;
    }
    await userModel
        .create(req.body)
        .then(() => res.json("Success"))
        .catch((err) => res.json(err));
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
