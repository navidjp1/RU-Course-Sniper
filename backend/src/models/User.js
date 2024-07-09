const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    courseIDs: {
        type: Array,
        default: [],
    },
    preferences: {
        emailNotifications: {
            type: Boolean,
            default: true,
        },
        smsNotifications: {
            type: Boolean,
            default: false,
        },
    },
    restartTime: {
        type: String,
        default: "18:00",
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
