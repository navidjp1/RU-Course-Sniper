import mongoose from "mongoose";

const courseDataSchema = new mongoose.Schema(
    {
        index: { type: String },
        section: { type: String },
        name: { type: String },
    },
    { collection: "Spring-2026" } // change based on desired semester
);

const CourseData = mongoose.model("CourseData", courseDataSchema, "Spring-2026");

export default CourseData;
