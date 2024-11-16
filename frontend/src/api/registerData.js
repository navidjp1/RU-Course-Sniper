import "dotenv/config";
import axios from "axios";
import { toast } from "sonner";

const api_base_url = process.env.API_BASE_URL || "http://localhost:3000";

export async function registerUser(uid) {
    try {
        const response = await axios.put(`${api_base_url}/api/users/${uid}`);
        if (response.status !== 200) throw new Error(response.data);
        return { status: 200 };
    } catch (error) {
        console.error(`Error registering user: ${error}`);
        toast.error("There was an error in the system. Try again later.");
        return { status: 500 };
    }
}
