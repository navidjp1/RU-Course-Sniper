import mongoose from "mongoose";

const courseDataSchema = new mongoose.Schema(
    {
        index: { type: String },
        section: { type: String },
        name: { type: String },
    },
    { collection: "schedule_of_classes" }
);

const CourseData = mongoose.model("CourseData", courseDataSchema);

export default CourseData;
