import express from "express";
import axios from "axios";
import NodeCache from "node-cache";

const app = express();
const cache = new NodeCache();
const REFRESH_INTERVAL = 4000; // 10 seconds
const CACHE_KEY = "openCourses";

async function fetchCoursesAndCache() {
    try {
        const response = await axios.request({
            method: "GET",
            url: "https://classes.rutgers.edu/soc/api/openSections.json",
            params: { year: "2024", term: "9", campus: "NB" }, // Add params here
        });
        const courses = response.data;
        cache.set(CACHE_KEY, courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
}

// Fetch and cache the data every 4 seconds
setInterval(fetchCoursesAndCache, REFRESH_INTERVAL);

// Serve the cached data to users
app.get("/api/courses", (req, res) => {
    const cachedCourses = cache.get(CACHE_KEY);
    if (cachedCourses) {
        res.json(cachedCourses);
    } else {
        res.status(503).json({
            error: "Data not available yet. Please try again later.",
        });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
    // Initial fetch to populate the cache when the server starts
    fetchCoursesAndCache();
});
