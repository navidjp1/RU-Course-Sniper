import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import usersRoutes from "./routes/users.js";
import coursesRoutes from "./routes/courses.js";
import sniperRoutes from "./routes/sniper.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/users", usersRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/sniper", sniperRoutes);

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to database");
    } catch (error) {
        console.log(`There was an error connecting to the database: ${error}`);
    }
})();

app.listen(3000, () => {
    console.log("server is running on port 3000");
});
