import NodeCache from "node-cache";
import axios from "axios";

const cache = new NodeCache();
const REFRESH_INTERVAL = 15000; // 10 seconds
const CACHE_KEY = "openCourses";
let requestCount = 0;
let first = true;

async function fetchCoursesAndCache() {
    try {
        if (!(await isDowntime())) {
            requestCount++;
            if (requestCount % 10 == 0) {
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
        console.error("Error fetching courses:", error);
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

    if (time <= 6 * 60 + 5 && time >= 1 * 60 + 55) {
        if (first) console.log(`It is ${hour}:${minute}. WebReg is down...`);
        let timeout = (6 * 60 + 10 - time) * 60;
        if (first) console.log(`Halting program for ${timeout} seconds.`);
        first = false;
        return true;
    } else {
        first = true;
        return false;
    }
}

export { initializeProxy, getCachedCourses };
