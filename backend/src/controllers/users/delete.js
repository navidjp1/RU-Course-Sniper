import userModel from "../../models/User.js";

export const deleteUser = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await userModel.deleteOne({ uid });

        if (user.acknowledged === true && user.deletedCount === 1) {
            res.status(200).json({ message: "Credentials deleted successfully" });
        } else {
            res.status(204).json({ message: "User not found" });
        }
    } catch (err) {
        console.log(`Error deleting user credentials: ${err}`);
        res.status(206).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};

export const deleteCreds = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await userModel.findOne({ uid });

        if (!user) {
            return res.status(204).json({ message: "User not found" });
        }

        user.RUID = "";
        user.PAC = "";
        await user.save();
        res.status(200).json({ message: "Credentials deleted successfully" });
    } catch (err) {
        console.log(`Error deleting user credentials: ${err}`);
        res.status(206).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};
