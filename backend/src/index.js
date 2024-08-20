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

app.post("/api/get_data", async (req, res) => {
    try {
        const { username } = req.body;
        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userTokenBalance = user.tokenBalance;
        const idObjects = user.courseIDs;

        const courses = await Promise.all(
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
        res.status(200).json({ courses, userTokenBalance });
    } catch (err) {
        console.log(`Error fetching course data: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
});

app.post("/api/get_balance", async (req, res) => {
    try {
        const { username } = req.body;
        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userTokenBalance = user.tokenBalance;

        res.status(200).json({ userTokenBalance });
    } catch (err) {
        console.log(`Error fetching course data: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
});

app.post("/api/get_creds", async (req, res) => {
    try {
        const { username } = req.body;
        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const RUID = user.RUID;
        const PAC = user.PAC;
        res.status(200).json({ RUID, PAC });
    } catch (err) {
        console.log(`Error fetching user creds: ${err}`);
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
            user.tokenBalance -= 1;
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

app.post("/api/purchase_tokens", async (req, res) => {
    try {
        const { username, numTokens } = req.body;
        const user = await userModel.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.tokenBalance += numTokens;
        await user.save();
        res.status(200).json({ message: "Tokens added successfully" });
    } catch (err) {
        console.log(`Error updating user token balance: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
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

app.post("/api/register_username", async (req, res) => {
    const { username } = req.body;
    await userModel
        .create({ username })
        .then(() =>
            res.status(200).json({ message: "Successfully registered username in DB" })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                message: `Error processing request: ${err.message}`,
            });
        });
});

app.post("/api/update_creds", async (req, res) => {
    try {
        const { username, RUID, PAC } = req.body;
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.RUID = RUID;
        user.PAC = PAC;
        user.testLogin = false;

        await user.save();
        res.status(200).json({ message: "Successfully updated credentials" });
    } catch (err) {
        console.log(`Error updating user token balance: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
});

app.post("/api/delete_creds", async (req, res) => {
    try {
        const { username } = req.body;
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.RUID = "";
        user.PAC = "";
        await user.save();
        res.status(200).json({ message: "Credentials deleted successfully" });
    } catch (err) {
        console.log(`Error deleting user credentials: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
