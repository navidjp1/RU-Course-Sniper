import axios from "axios";
import { toast } from "sonner";

export async function callStartSniper(uid) {
    try {
        const response = await axios.get(`http://localhost:3000/api/sniper/${uid}`);
        if (response.status !== 200) throw new Error(response);

        toast.success("Successfully started sniping your courses!");

        return { status: 200 };
    } catch (error) {
        const msg = error.response.data.message;
        if (msg === "No cred") {
            toast.warning(
                "You have not entered in your required credentials in order to start sniping. Please do so at the settings page."
            );
        } else if (msg === "Invalid login credentials") {
            toast.error(
                "Your login credentials did not work. Make sure you entered in your correct RUID and birthday in the settings page."
            );
        } else if (msg === "Invalid drop IDs") {
            toast.error(
                "One or more of the courses you intend to drop are courses that you are not currently enrolled in. Please update them and try again."
            );
        } else {
            console.error(`Error starting sniper: ${error}`);
            toast.error("There was an error in the system. Try again later.");
        }
        return { status: 500 };
    }
}

export async function callStopSniper() {
    try {
        const response = await axios.get("http://localhost:3000/api/sniper/stop", {});
        if (response.status !== 200) throw new Error(response);

        toast.success("Successfully stopped sniping your courses!");

        return { status: 200 };
    } catch (error) {
        console.error(`Error stopping sniper: ${error}`);
        toast.error("There was an error in the system. Try again later.");
        return { status: 500 };
    }
}
