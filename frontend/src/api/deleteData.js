import axios from "axios";
import { toast } from "sonner";

const api_base_url = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function deleteAccountFromDB(uid) {
    try {
        await axios.delete(`${api_base_url}/api/users/${uid}`);
        return { status: 200 };
    } catch (error) {
        console.error(`Error deleting account: ${error.response.data}`);
        toast.error("There was an error in the system. Try again later.");
        return { status: error.response.status };
    }
}
export async function deleteCreds(uid) {
    try {
        await axios.delete(`${api_base_url}/api/users/creds/${uid}`);
        return { status: 200 };
    } catch (error) {
        console.error(`Error registering username: ${error.response.data}`);
        toast.error("There was an error in the system. Try again later.");
        return { status: error.response.status };
    }
}
