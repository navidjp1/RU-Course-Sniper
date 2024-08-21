import axios from "axios";
import { toast } from "sonner";

export async function updateCreds(uid, RUID, PAC) {
    try {
        const response = await axios.post("http://localhost:3000/api/update_creds", {
            uid,
            RUID,
            PAC,
        });
        if (response.status !== 200) throw new Error(response.data);
        return { status: 200 };
    } catch (error) {
        console.error(`Error updating user creds: ${error}`);
        toast.error("There was an error in the system. Try again later.");
        return { status: 500 };
    }
}

export async function updateDropIDs(uid, courseID, newDropIDs) {
    try {
        const response = await axios.post("http://localhost:3000/api/update_drop_ids", {
            uid,
            courseID,
            newDropIDs,
        });
        if (response.status !== 200) throw new Error(response);
        return { status: 200 };
    } catch (error) {
        console.error(
            `Error updating drop IDs for course index: ${courseID}: ${error.response.data}`
        );
        toast.error("There was an error in the system. Try again later.");
        return { status: 500 };
    }
}
