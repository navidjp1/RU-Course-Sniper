import NodeCache from "node-cache";
import axios from "axios";

const cache = new NodeCache();
const REFRESH_INTERVAL = 10000; // 10 seconds
const CACHE_KEY = "openCourses";
let requestCount = 0;

async function fetchCoursesAndCache() {
    try {
        requestCount++;

        const response = await axios.request({
            method: "GET",
            url: "https://classes.rutgers.edu/soc/api/openSections.json",
            params: { year: "2025", term: "1", campus: "NB" },
        });
        if (requestCount % 5 == 0) {
            console.log(`Request count for proxy server: ${requestCount}`);
            console.log(response.data);
        }

        const courses = response.data;
        cache.set(CACHE_KEY, courses);
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

export { initializeProxy, getCachedCourses };
