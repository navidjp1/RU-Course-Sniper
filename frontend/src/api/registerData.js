import axios from "axios";
import { toast } from "sonner";

export async function registerUser(uid) {
    try {
        const response = await axios.post("http://localhost:3000/api/register_user", {
            uid,
        });
        if (response.status !== 200) throw new Error(response.data);
        return { status: 200 };
    } catch (error) {
        console.error(`Error registering user: ${error}`);
        toast.error("There was an error in the system. Try again later.");
        return { status: 500 };
    }
}
