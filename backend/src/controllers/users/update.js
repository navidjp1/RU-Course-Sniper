import userModel from "../../models/User.js";

export const registerUser = async (req, res) => {
    const uid = req.params.uid;
    await userModel
        .create({ uid })
        .then(() =>
            res.status(200).json({ message: "Successfully registered user in DB" })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                message: `Error processing request: ${err.message}`,
            });
        });
};

export const updateBalance = async (req, res) => {
    try {
        const uid = req.params.uid;
        const { numTokens } = req.body;
        const user = await userModel.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.tokenBalance += numTokens;
        await user.save();
        res.status(200).json({ message: "Tokens added successfully" });
    } catch (err) {
        console.log(`Error updating user token balance: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};

export const updateCreds = async (req, res) => {
    try {
        const uid = req.params.uid;
        const { RUID, PAC } = req.body;
        const user = await userModel.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.RUID = RUID;
        user.PAC = PAC;
        user.testedLogin = false;

        await user.save();
        res.status(200).json({ message: "Successfully updated credentials" });
    } catch (err) {
        console.log(`Error updating user token balance: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};

export const updateDropIDs = async (req, res) => {
    const uid = req.params.uid;
    const { courseID, newDropIDs } = req.body;

    try {
        const user = await userModel.findOne({ uid });

        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        const courseToUpdate = user.courseIDs.find((course) => course.add === courseID);
        courseToUpdate.drop = newDropIDs;
        user.testedLogin = false;

        await user.save();
        res.status(200).json({
            message: "Successfully updated drop IDs for course index " + courseID,
        });
    } catch (err) {
        console.log(`Error updating drop IDs for course index: ${courseID}: ${err}`);
        res.status(500).json({ message: `Error updating drop IDs: ${err}` });
    }
};
