import courseModel from "../../models/CourseData.js";
import userModel from "../../models/User.js";

export const getCoursesAndBalance = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await userModel.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userTokenBalance = user.tokenBalance;
        const idObjects = user.courseIDs;

        const courses = await Promise.all(
            idObjects.map(async (obj) => {
                const id = obj.add;
                const dropIDs = obj.drop;
                const idData = await courseModel.findOne({ index: id });
                if (idData) {
                    const section = idData.section;
                    const title = idData.name;

                    return { id, section, title, dropIDs };
                } else {
                    return { id, section: null, title: null, dropIDs };
                }
            })
        );
        res.status(200).json({ courses, userTokenBalance });
    } catch (err) {
        console.log(`Error fetching course data: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};

export const getCreds = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await userModel.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const RUID = user.RUID;
        const PAC = user.PAC;
        res.status(200).json({ RUID, PAC });
    } catch (err) {
        console.log(`Error fetching user creds: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};

export const getBalance = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await userModel.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userTokenBalance = user.tokenBalance;

        res.status(200).json({ userTokenBalance });
    } catch (err) {
        console.log(`Error fetching course data: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};
