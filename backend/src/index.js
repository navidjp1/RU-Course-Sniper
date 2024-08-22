import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userModel from "./models/User.js";
import courseModel from "./models/CourseData.js";
import runSniper from "./sniper/pacLogin/sniperPAC.js";
import { testLogin } from "./sniper/pacLogin/testLogin.js";

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
        const { uid } = req.body;
        const user = await userModel.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userTokenBalance = user.tokenBalance;
        const idObjects = user.courseIDs;

        const courses = await Promise.all(
            idObjects.map(async (obj) => {
                const id = obj.add;
                const dropIDs = obj.drop;
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
        const { uid } = req.body;
        const user = await userModel.findOne({ uid });

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
        const { uid } = req.body;
        const user = await userModel.findOne({ uid });

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
    try {
        const { courseID } = req.body;
        const id = await courseModel.findOne({ index: courseID });

        if (!id) {
            return res.status(404).json({ message: "Course not found in DB" });
        }

        res.status(200).json({ message: "Course was found" });
    } catch (err) {
        console.log(`Error checking for course: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
});

app.post("/api/add_course", async (req, res) => {
    try {
        const { uid, courseID, dropIDs } = req.body;
        const user = await userModel.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const idObjects = user.courseIDs;
        const found = idObjects.some((obj) => obj.add === courseID);
        if (found) {
            return res.status(208).json("Course already in user's list");
        }
        idObjects.push({ add: courseID, drop: dropIDs });
        user.testedLogin = false;
        user.tokenBalance -= 1;
        await user.save();

        res.status(200).json({ message: "Successfully added course" });
    } catch (err) {
        console.log(`Error adding course: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
});

app.post("/api/delete_course", async (req, res) => {
    const { uid, courseID } = req.body;

    try {
        const result = await userModel.updateOne(
            { uid },
            { $pull: { courseIDs: { add: courseID.id } } }
        );
        res.json("Success");
    } catch (err) {
        console.error("Error removing courseID:", err);
        res.json(`Error deleting course ${err}`);
    }
});

app.post("/api/start_sniper", async (req, res) => {
    const { uid } = req.body;

    userModel
        .findOne({ uid })
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
        const { uid, numTokens } = req.body;
        const user = await userModel.findOne({ uid });

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

app.post("/api/register_user", async (req, res) => {
    const { uid } = req.body;
    await userModel
        .create({ uid })
        .then(() =>
            res.status(200).json({ message: "Successfully registered user in DB" })
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
        const { uid, RUID, PAC } = req.body;
        const user = await userModel.findOne({ uid });

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

app.post("/api/update_drop_ids", async (req, res) => {
    const { uid, courseID, newDropIDs } = req.body;

    try {
        const user = await userModel.findOne({ uid });

        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        const courseToUpdate = user.courseIDs.find((course) => course.add === courseID);
        courseToUpdate.drop = newDropIDs;
        await user.save();
        res.status(200).json({
            message: "Successfully updated drop IDs for course index " + courseID,
        });
    } catch (err) {
        console.log(`Error updating drop IDs for course index: ${courseID}: ${err}`);
        res.status(500).json({ message: `Error updating drop IDs: ${err}` });
    }
});

app.post("/api/delete_creds", async (req, res) => {
    try {
        const { uid } = req.body;
        const user = await userModel.findOne({ uid });

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

app.post("/api/delete_account", async (req, res) => {
    try {
        const { uid } = req.body;
        const user = await userModel.deleteOne({ uid });

        if (user.acknowledged === true && user.deletedCount === 1) {
            res.status(200).json({ message: "Credentials deleted successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
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
