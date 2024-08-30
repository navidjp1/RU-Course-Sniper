import userModel from "../models/User.js";
import { testLogin } from "../sniper/pacLogin/testLogin.js";
import { handleSniper } from "../sniper/pacLogin/handler.js";
import { decrypt } from "../utils.js";

export const startSniper = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await userModel.findOne({ uid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const RUID = user.RUID ? await decrypt(user.RUID) : "";
        const PAC = user.PAC ? await decrypt(user.PAC) : "";
        const testedLogin = user.testedLogin;
        const isSniping = user.isSniping;
        const idObjects = user.courseIDs.filter((obj) => obj.status === "INACTIVE");

        if (isSniping) {
            return res.status(400).json({ message: "Already sniping" });
        }
        if (RUID === "" || PAC === "") {
            return res.status(400).json({ message: "No credentials" });
        }
        if (idObjects.length === 0) {
            return res.status(400).json({ message: "No courses" });
        }

        if (!testedLogin) {
            const msg = await testLogin(RUID, PAC, idObjects);
            if (msg != "Success") {
                return res.status(400).json({ message: msg });
            }
            user.testedLogin = true;
            await user.save();
        }

        // TODO: pass in user variable instead & update accordingly
        handleSniper(true, RUID, PAC, idObjects, uid);

        // set status of all courses to "SNIPING"
        await setCoursesSniping(user);

        res.status(200).json("Successfully started sniping your courses!");
    } catch (err) {
        console.log(`Error starting sniper: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};

export const stopSniper = async (req, res) => {
    try {
        const success = await handleSniper(false, "", "", [], "");
        if (success) {
            const uid = req.params.uid;
            const user = await userModel.findOne({ uid });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            await setCoursesInactive(user);
            res.status(200).json({ message: "Successfully stopped the sniper!" });
        } else {
            res.status(500).json({ message: `Error processing request ${err}` });
        }
    } catch (err) {
        console.log(`Error updating course statuses: ${err}`);
        res.status(500).json({
            message: `Error processing request: ${err.message}`,
        });
    }
};

async function setCoursesInactive(user) {
    user.isSniping = false;
    user.courseIDs.forEach((obj) => {
        if (obj.status === "SNIPING") {
            obj.status = "INACTIVE";
        }
    });
    await user.save();
}

async function setCoursesSniping(user) {
    user.isSniping = true;
    user.courseIDs.forEach((obj) => {
        if (obj.status === "INACTIVE") {
            obj.status = "SNIPING";
        }
    });
    await user.save();
}
