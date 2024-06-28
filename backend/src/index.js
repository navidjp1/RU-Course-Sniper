require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userModel = require("./models/User");
const courseModel = require("./models/CourseData");

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

app.post("/dashboard", async (req, res) => {
    const { username, courseIdx, campus, semester, year } = req.body;

    userModel
        .findOne({ username: username })
        .then(async (user) => {
            id = user.courseIDs;
            id.push(courseIdx);
            await user.save();
            res.json("Success");
        })
        .catch((err) => {
            res.json(`Error adding course ${err}`);
        });
});

app.post("/signup", async (req, res) => {
    await userModel
        .create(req.body)
        .then((users) => res.json(users))
        .catch((err) => res.json(err));
});

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
