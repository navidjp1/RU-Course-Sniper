import userModel from "../models/User.js";
import runSniper from "../sniper/pacLogin/sniperPAC.js";
import { testLogin } from "../sniper/pacLogin/testLogin.js";
export const startSniper = async (req, res) => {
    const uid = req.params.uid;

    userModel
        .findOne({ uid })
        .then(async (user) => {
            const RUID = user.RUID;
            const PAC = user.PAC;
            const testedLogin = user.testedLogin;
            const idObjects = user.courseIDs;
            if (RUID === "" || PAC === "") {
                res.status(400).json("Credentials have not been entered");
            } else if (!testedLogin) {
                const msg = await testLogin(RUID, PAC, idObjects);
                if (msg != "Success") {
                    res.status(400).json(msg);
                    return;
                }
                user.testedLogin = true;
                await user.save();
            }

            const restartTime = user.restartTime.split(":").map(Number);

            runSniper(RUID, PAC, idObjects, restartTime, true);
            res.status(200).json("Successfully started sniping your courses!");
        })
        .catch((err) => {
            res.status(500).json(`Error processing request ${err}`);
        });
};

export const stopSniper = async (req, res) => {
    const success = await runSniper("", "", [], [], false);
    success
        ? res.status(200).json("Successfully stopped sniping your courses!")
        : res.status(500).json(`Error processing request ${err}`);
};
