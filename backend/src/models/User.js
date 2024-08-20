const mongoose = require("mongoose");

const courseIDSchema = new mongoose.Schema({
    add: {
        type: String,
        required: true,
    },
    drop: {
        type: [String], // Array of strings
        default: [], // Optional field
    },
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    courseIDs: {
        type: [courseIDSchema],
        default: [],
    },
    tokenBalance: {
        type: Number,
        default: 0,
    },
    RUID: {
        type: String,
        default: "",
    },
    PAC: {
        type: String,
        default: "",
    },
    testedLogin: {
        type: Boolean,
        default: false,
    },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
