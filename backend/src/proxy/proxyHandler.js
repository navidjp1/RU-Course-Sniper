import NodeCache from "node-cache";
import axios from "axios";

const cache = new NodeCache();
const REFRESH_INTERVAL = 4000; // 4 seconds
const CACHE_KEY = "openCourses";

async function fetchCoursesAndCache() {
    try {
        const response = await axios.request({
            method: "GET",
            url: "https://classes.rutgers.edu/soc/api/openSections.json",
            params: { year: "2024", term: "1", campus: "NB" },
        });
        const courses = response.data;
        cache.set(CACHE_KEY, courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
}

function getCachedCourses(req, res) {
    const cachedCourses = cache.get(CACHE_KEY);
    if (cachedCourses) {
        res.json(cachedCourses);
    } else {
        res.status(503).json({
            error: "Data not available yet. Please try again later.",
        });
    }
}

function initializeProxy() {
    console.log("Initializing proxy...");
    fetchCoursesAndCache();
    setInterval(fetchCoursesAndCache, REFRESH_INTERVAL);
}

export { initializeProxy, getCachedCourses };
