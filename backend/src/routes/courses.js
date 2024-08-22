import express from "express";
import { courseExists, addCourse, removeCourse } from "../controllers/courses.js";

const router = express.Router();

router.get("/:courseID", courseExists);

router.post("/add/:courseID", addCourse);

router.post("/remove", removeCourse);

export default router;
