import NodeCache from "node-cache";
import axios from "axios";

const cache = new NodeCache();
const REFRESH_INTERVAL = 15000; // 10 seconds
const CACHE_KEY = "openCourses";
let requestCount = 0;
let downtimeCount = 0;

async function fetchCoursesAndCache() {
    try {
        const downtime = await isDowntime();
        if (downtime) {
            downtimeCount++;
        } else {
            requestCount++;
            if (requestCount % 100 == 0) {
                console.log(`Request count for proxy server: ${requestCount}`);
            }
            const response = await axios.request({
                method: "GET",
                url: "https://classes.rutgers.edu/soc/api/openSections.json",
                params: { year: "2025", term: "1", campus: "NB" },
            });

            const courses = response.data;
            cache.set(CACHE_KEY, courses);
        }
    } catch (error) {
        console.error("Error fetching courses:", error.message);
    }
}

function getCachedCourses(req, res) {
    const cachedCourses = cache.get(CACHE_KEY);
    if (cachedCourses) {
        return cachedCourses;
    } else {
        return { error: "Data not available yet. Please try again later." };
    }
}

function initializeProxy() {
    console.log("Initializing proxy...");
    fetchCoursesAndCache();
    setInterval(fetchCoursesAndCache, REFRESH_INTERVAL);
}

async function isDowntime() {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let time = hour * 60 + minute;

    const downtimeStart = 6 * 60 + 55;
    const downtimeEnd = 11 * 60 + 5;

    // const downtimeStart = 1 * 60 + 55;
    // const downtimeEnd = 6 * 60 + 5;

    if (time <= downtimeEnd && time >= downtimeStart) {
        requestCount = 0;
        if (downtimeCount % 100 == 0) {
            console.log(`It is ${hour}:${minute} UTC. WebReg is down...`);
        }
        return true;
    } else {
        downtimeCount = 0;
        return false;
    }
}

export { initializeProxy, getCachedCourses };
