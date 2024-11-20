import axios from "axios";
import { toast } from "sonner";

const api_base_url = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function registerUser(uid) {
    try {
        await axios.put(`${api_base_url}/api/users/${uid}`);
        return { status: 200 };
    } catch (error) {
        console.error(`Error registering user: ${error.response.data}`);
        toast.error("There was an error in the system. Try again later.");
        return { status: error.response.status };
    }
}
