import axios from "axios";
import { toast } from "sonner";

export async function deleteAccountFromDB(uid) {
    try {
        const response = await axios.delete(`http://localhost:3000/api/users/${uid}`);
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
        const response = await axios.delete(
            `http://localhost:3000/api/users/creds/${uid}`
        );
        if (response.status !== 200) throw new Error(response.data);
        return { status: 200 };
    } catch (error) {
        console.error(`Error registering username: ${error}`);
        toast.error("There was an error in the system. Try again later.");
        return { status: 500 };
    }
}
