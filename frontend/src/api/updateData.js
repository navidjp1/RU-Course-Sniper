import axios from "axios";
import { toast } from "sonner";

const api_base_url = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export async function updateCreds(uid, RUID, PAC) {
    try {
        const creds = { RUID, PAC };
        await axios.post(`${api_base_url}/api/users/creds/${uid}`, creds);
        return { status: 200 };
    } catch (error) {
        if (error.response.status === 400) {
            toast.error(
                "There is already a user with that RUID. Two accounts cannot share the same RUID."
            );
            return { status: 400 };
        }
        console.error(`Error updating user creds: ${error}`);
        toast.error("There was an error in the system. Try again later.");
        return { status: error.response.status };
    }
}

export async function updateDropIDs(uid, courseID, newDropIDs) {
    try {
        const dropIDData = { courseID, newDropIDs };
        await axios.post(`${api_base_url}/api/users/dropids/${uid}`, dropIDData);

        return { status: 200 };
    } catch (error) {
        console.error(
            `Error updating drop IDs for course index: ${courseID}: ${error.response.data}`
        );
        toast.error("There was an error in the system. Try again later.");
        return { status: error.response.status };
    }
}
