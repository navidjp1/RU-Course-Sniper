import mongoose from "mongoose";

const courseIDSchema = new mongoose.Schema({
    add: {
        type: String,
        required: true,
    },
    drop: {
        type: [String], // Array of strings
        default: [], // Optional field
    },
    status: {
        type: String,
        default: "INACTIVE",
    },
});

const userSchema = new mongoose.Schema({
    uid: {
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

export default userModel;
