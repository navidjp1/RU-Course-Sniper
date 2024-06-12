require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userModel = require("./models/User");

const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true, // if your frontend sends cookies
    })
);
(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database");
    } catch (error) {
        console.log(`There was an error connecting to the database: ${error}`);
    }
})();

app.post("/signup", async (req, res) => {
    console.log("HI");
    await userModel
        .create(req.body)
        .then((users) => res.json(users))
        .catch((err) => res.json(err));
});

app.listen(5173, () => {
    console.log("server is running on port 5173");
});
