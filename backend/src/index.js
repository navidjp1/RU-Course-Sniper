require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userModel = require("./models/User");

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

app.post("/dashboard", async (req, res) => {
    const { courseIdx, campus, semester, year } = req.body;
    console.log(courseIdx);
    console.log(campus);
    console.log(semester);
    console.log(year);

    res.json("Success");
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
