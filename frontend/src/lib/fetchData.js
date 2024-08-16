import axios from "axios";

export async function fetchUserCreds(username) {
    try {
        const response = await axios.post("http://localhost:3000/api/get_data", {
            username,
        });
        const RUID = response.data.RUID;
        const PAC = response.data.PAC;
        return { RUID, PAC };
    } catch (error) {
        console.error(`Error fetching courses: ${err}`);
        return { RUID: "", PAC: "" };
    }
}
