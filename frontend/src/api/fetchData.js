import axios from "axios";
import { toast } from "sonner";

const api_base_url = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function fetchUserData(uid) {
    try {
        const response = await axios.get(`${api_base_url}/api/users/${uid}`);
        const courses = response.data.courses;
        const userTokenBalance = response.data.userTokenBalance;
        const isSniping = response.data.isSniping;

        return { courses, userTokenBalance, isSniping };
    } catch (error) {
        console.error(`Error fetching user data: ${error.response.data}`);
        toast.error("There was an error in the system. Try again later.");
        return { courses: "", userTokenBalance: "", isSniping: false };
    }
}

export async function fetchUserCreds(uid) {
    try {
        const response = await axios.get(`${api_base_url}/api/users/creds/${uid}`);
        const RUID = response.data.RUID;
        const PAC = response.data.PAC;
        return { RUID, PAC };
    } catch (error) {
        console.error(`Error fetching user creds: ${error.response.data}`);
        toast.error("There was an error in the system. Try again later.");
        return { RUID: "", PAC: "" };
    }
}

export async function fetchTokenBalance(uid) {
    try {
        const response = await axios.get(`${api_base_url}/api/users/balance/${uid}`);
        const userTokenBalance = response.data.userTokenBalance;
        return { userTokenBalance };
    } catch (error) {
        console.error(`Error fetching user token balance: ${error.response.data}`);
        toast.error("There was an error in the system. Try again later.");
        return { userTokenBalance: "" };
    }
}
