import courseModel from "../models/CourseData.js";
import userModel from "../models/User.js";

export const courseExists = async (req, res) => {
    try {
        const courseID = req.params.courseID;
        const id = await courseModel.findOne({ index: courseID });

        if (!id) {
            return res.status(404).json({ message: "Course not found in DB" });
        }

        res.status(200).json({ message: "Course was found" });
    } catch (err) {
        console.log(`Error checking for course: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};

export const addCourse = async (req, res) => {
    try {
        const courseID = req.params.courseID;
        const { uid, dropIDs } = req.body;
        const user = await userModel.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const idObjects = user.courseIDs;
        const found = idObjects.some((obj) => obj.add === courseID);
        if (found) {
            return res.status(208).json("Course already in user's list");
        }
        idObjects.push({ add: courseID, drop: dropIDs });
        user.testedLogin = false;
        user.tokenBalance -= 1;
        await user.save();

        res.status(200).json({ message: "Successfully added course" });
    } catch (err) {
        console.log(`Error adding course: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};

export const removeCourse = async (req, res) => {
    const { uid, course } = req.body;

    try {
        const result = await userModel.updateOne(
            { uid },
            { $pull: { courseIDs: { add: course.id } } }
        );
        if (result.modifiedCount === 0)
            return res.status(208).json("Course id not found");
        res.status(200).json({ message: "Successfully removed course" });
    } catch (err) {
        console.log("Error removing courseID:", err);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};
