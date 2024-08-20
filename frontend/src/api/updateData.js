import axios from "axios";
import { toast } from "sonner";

export async function updateCreds(username, RUID, PAC) {
    try {
        const response = await axios.post("http://localhost:3000/api/update_creds", {
            username,
            RUID,
            PAC,
        });
        if (response.status !== 200) throw new Error(response.data);
        return { status: 200 };
    } catch (error) {
        console.error(`Error registering username: ${error}`);
        toast.error("There was an error in the system. Try again later.");
        return { status: 500 };
    }
}
