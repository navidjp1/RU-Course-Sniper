import "dotenv/config";
import axios from "axios";
import { toast } from "sonner";

const api_base_url = process.env.API_BASE_URL || "http://localhost:3000";

export async function deleteAccountFromDB(uid) {
    try {
        const response = await axios.delete(`${api_base_url}/api/users/${uid}`);
        if (response.status !== 200) throw new Error(response.data);
        return { status: 200 };
    } catch (error) {
        console.error(`Error deleting account: ${error}`);
        toast.error("There was an error in the system. Try again later.");
        return { status: 500 };
    }
}
export async function deleteCreds(uid) {
    try {
        const response = await axios.delete(`${api_base_url}/api/users/creds/${uid}`);
        if (response.status !== 200) throw new Error(response.data);
        return { status: 200 };
    } catch (error) {
        console.error(`Error registering username: ${error}`);
        toast.error("There was an error in the system. Try again later.");
        return { status: 500 };
    }
}
