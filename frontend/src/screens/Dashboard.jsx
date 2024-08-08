import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AddCourse from "../components/AddCourse";
import DeleteCourse from "../components/DeleteCourse";
import { doSignOut } from "../firebase/auth";
import { useAuth } from "../contexts/authContext/authContext";

export const Dashboard = () => {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState({});
    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [update, setUpdate] = useState(false);
    const navigate = useNavigate();

    const fetchCourses = async () => {
        const username = currentUser.displayName;
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
        setUpdate(false);
    }, [update]);

    const updateRender = () => {
        setUpdate(true); // Trigger useEffect to refetch courses
    };

    const handleStart = async (event) => {
        event.preventDefault();

        setDisabled(true);
        const username = currentUser.displayName;

        await axios
            .post("http://localhost:3000/api/start_sniper", { username })
            .then((response) => {
                const msg = response.data;
                if (msg === "Success") {
                    alert("Successfully started sniping your courses!");
                    return;
                }
                if (msg === "No cred") {
                    alert(
                        "You have not entered in your required credentials in order to start sniping. Please do so at the settings page."
                    );
                } else if (msg === "Invalid login credentials") {
                    alert(
                        "Your login credentials did not work. Make sure you entered in your correct RUID and birthday in the settings page."
                    );
                } else if (msg === "Invalid drop IDs") {
                    alert(
                        "One or more of the courses you intend to drop are courses that you are not currently enrolled in. Please update them and try again."
                    );
                } else {
                    console.log(msg);
                    alert("There was an error in the system. Try again later.");
                }
                setDisabled(false);
            })
            .catch((err) => {
                console.log(`Error sending api request: ${err}`);
                setDisabled(false);
            });
    };

    const handleStop = async (event) => {
        event.preventDefault();

        setDisabled(false);

        await axios
            .post("http://localhost:3000/api/stop_sniper", {})
            .then((response) => {
                const msg = response.data;
                if (msg === "Success") {
                    alert("Successfully stopped sniping your courses!");
                } else {
                    console.log(msg);
                    alert("There was an error in the system. Try again later.");
                    setDisabled(true);
                }
            })
            .catch((err) => {
                console.log(`Error starting sniper: ${err}`);
                setDisabled(true);
            });
    };

    const handleLogout = async (event) => {
        event.preventDefault();
        const userConfirm = confirm("Are you sure you want to logout?");
        if (userConfirm) {
            console.log(currentUser);
            await doSignOut();
            navigate("/");
        }
    };

    return (
        <main className="dashboard">
            {!loading && (
                <>
                    <div>
                        <button
                            className="absolute top-10 right-10"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                    <Link to="/settings">
                        <button className="absolute top-10 left-10">Settings</button>
                    </Link>
                    <div className="p-4">
                        <button
                            className="mx-4"
                            onClick={handleStart}
                            disabled={disabled}
                        >
                            Start Sniping
                        </button>
                        <button
                            className="mx-4"
                            onClick={handleStop}
                            disabled={!disabled}
                        >
                            Stop Sniping
                        </button>
                    </div>
                    <div className="space-y-4 mb-4 px-4">
                        {courses.length === 0 ? (
                            <p>No courses yet. Add a course to get started!</p>
                        ) : (
                            <div className="courses-grid">
                                {courses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="p-4 bg-white shadow rounded-lg relative"
                                    >
                                        <p className="font-bold">{course.title}</p>
                                        <p className="font-semibold">
                                            Index: {course.id} Section: {course.section}
                                        </p>
                                        <DeleteCourse
                                            updateRender={updateRender}
                                            courseID={course}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <AddCourse updateRender={updateRender} />
                </>
            )}
        </main>
    );
};
