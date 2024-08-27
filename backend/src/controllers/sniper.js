import userModel from "../models/User.js";
import { testLogin } from "../sniper/pacLogin/testLogin.js";
import { handleSniper } from "../sniper/pacLogin/handler.js";
export const startSniper = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await userModel.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const RUID = user.RUID;
        const PAC = user.PAC;
        const testedLogin = user.testedLogin;
        const idObjects = user.courseIDs;
        if (RUID === "" || PAC === "") {
            return res.status(400).json("Credentials have not been entered");
        }
        if (!testedLogin) {
            const msg = await testLogin(RUID, PAC, idObjects);
            if (msg != "Success") {
                return res.status(400).json(msg);
            }
            user.testedLogin = true;
            await user.save();
        }

        handleSniper(true, RUID, PAC, idObjects);
        res.status(200).json("Successfully started sniping your courses!");
    } catch (err) {
        console.log(`Error starting sniper: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};

export const stopSniper = async (req, res) => {
    const success = await runSniper("", "", [], [], false);
    success
        ? res.status(200).json("Successfully stopped sniping your courses!")
        : res.status(500).json(`Error processing request ${err}`);
};
