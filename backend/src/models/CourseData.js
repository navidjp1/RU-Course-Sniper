const mongoose = require("mongoose");

var courseDataSchema = new mongoose.Schema(
    {
        index: { type: String },
        section: { type: String },
        name: { type: String },
    },
    { collection: "schedule_of_classes" }
);

var CourseData = mongoose.model("CourseData", courseDataSchema);

module.exports = CourseData;
