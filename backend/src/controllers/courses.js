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
            return res.status(400).json("Course already in user's list");
        }

        const position = (await countUsersSnipingCourse(courseID)) + 1;
        const status = position >= 4 ? "WAITLISTED" : "INACTIVE";

        idObjects.push({
            add: courseID,
            drop: dropIDs,
            status: status,
            position: position,
        });
        user.testedLogin = false;
        user.tokenBalance -= 1;
        await user.save();

        let message = "Successfully added course";
        if (status === "WAITLISTED") {
            message = `Successfully added course but you have been added to the waitlist at position ${
                position - 3
            }`;
        }

        res.status(200).json({ message });
    } catch (err) {
        console.log(`Error adding course: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};

async function countUsersSnipingCourse(courseIndex) {
    try {
        const count = await userModel.countDocuments({
            courseIDs: {
                $elemMatch: {
                    add: courseIndex,
                    status: { $ne: "REGISTERED" },
                },
            },
        });
        return count;
    } catch (error) {
        console.log("Error counting users: ", error);
        return 0;
    }
}

export const removeCourse = async (req, res) => {
    const { uid, course } = req.body;

    try {
        // const user = await userModel.findOneAndUpdate(
        //     { uid },
        //     { $pull: { courseIDs: { add: course.id } } }
        // );
        const user = await userModel.findOne({ uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const idObjects = user.courseIDs;
        const id = idObjects.find((obj) => obj.add === course.id);
        if (!id) {
            return res.status(404).json("Course id not found");
        }

        const position = id.position;
        if (id.status !== "REGISTERED") {
            await updateUserPositions(course.id, position);
        }

        user.courseIDs = idObjects.filter((obj) => obj.add !== course.id);
        user.tokenBalance += 1;
        await user.save();

        res.status(200).json({ message: "Successfully removed course" });
    } catch (err) {
        console.log("Error removing courseID:", err);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};

export async function updateUserPositions(courseIndex, coursePosition) {
    try {
        const usersWithCourse = await userModel.find({
            courseIDs: { $elemMatch: { add: courseIndex } },
        });

        for (const user of usersWithCourse) {
            const idObjects = user.courseIDs;
            const id = idObjects.find((obj) => obj.add === courseIndex);
            if (id.status === "REGISTERED") {
                continue;
            }
            if (id.position > coursePosition) {
                id.position -= 1;
            }
            if (id.position <= 3) {
                id.status = "INACTIVE";
            }
            await user.save();
        }
    } catch (error) {
        console.log("Error updating positions:", error);
    }
}
