import axios from "axios";
import { toast } from "sonner";

export async function fetchUserCreds(username) {
    try {
        const response = await axios.post("http://localhost:3000/api/get_creds", {
            username,
        });
        if (response.status !== 200) throw new Error(response.data);
        const RUID = response.data.RUID;
        const PAC = response.data.PAC;
        return { RUID, PAC };
    } catch (error) {
        console.error(`Error fetching user creds: ${error}`);
        toast.error("There was an error in the system. Try again later.");
        return { RUID: "", PAC: "" };
    }
}

export async function fetchUserData(username) {
    try {
        const response = await axios.post("http://localhost:3000/api/get_data", {
            username,
        });
        if (response.status !== 200) throw new Error(response.data);
        const courses = response.data.courses;
        const userTokenBalance = response.data.userTokenBalance;
        return { courses, userTokenBalance };
    } catch (error) {
        console.error(`Error fetching user data: ${error}`);
        toast.error("There was an error in the system. Try again later.");
        return { courses: "", userTokenBalance: "" };
    }
}

export async function fetchTokenBalance(username) {
    try {
        const response = await axios.post("http://localhost:3000/api/get_balance", {
            username,
        });
        if (response.status !== 200) throw new Error(response.data);
        const userTokenBalance = response.data.userTokenBalance;
        return { userTokenBalance };
    } catch (error) {
        console.error(`Error fetching user token balance: ${error}`);
        toast.error("There was an error in the system. Try again later.");
        return { userTokenBalance: "" };
    }
}
