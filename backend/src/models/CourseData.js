import mongoose from "mongoose";

const courseDataSchema = new mongoose.Schema(
    {
        index: { type: String },
        section: { type: String },
        name: { type: String },
    },
    { collection: "Spring-2025" }
);

const CourseData = mongoose.model("CourseData", courseDataSchema, "Spring-2025");

export default CourseData;
