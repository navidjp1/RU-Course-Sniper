import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AddCourse from "../components/AddCourse";
import axios from "axios";

export const Dashboard = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCourses = async () => {
        const username = localStorage.getItem("username");
        await axios
            .post("http://localhost:3000/api/get_courses", { username })
            .then((response) => {
                setCourses(response.data);
            })
            .catch((err) => console.log(`Error fetching courses: ${err}`))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCourses();
    });

    return (
        <main className="dashboard">
            <Link to="/">
                <button className="absolute top-10 right-10">Logout</button>
            </Link>
            {!loading && (
                <>
                    <div className="space-y-4">
                        {courses.length === 0 ? (
                            <p>No courses yet. Add a course to get started!</p>
                        ) : (
                            <div className="courses-grid">
                                {courses.map((course) => (
                                    <div
                                        key={course}
                                        className="p-4 bg-white shadow rounded-lg relative"
                                    >
                                        {/* <h2 className="text-xl font-bold">
                                            {course.title}
                                        </h2> */}
                                        <p className="font-semibold">
                                            Index: {course}
                                        </p>
                                        {/* Add more course details here */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <AddCourse />
                </>
            )}
        </main>
    );
};
