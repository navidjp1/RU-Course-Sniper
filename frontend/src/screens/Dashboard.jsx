import React from "react";
import CourseRow from "../components/CourseRow";
import Header from "../components/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AddCourse from "../components/AddCourse";
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
            await doSignOut();
            navigate("/");
        }
    };

    return (
        <main className="dashboard">
            {!loading && (
                <div className="bg-white ">
                    <Header pageNum={1} />
                    <div className="flex pt-20 flex-col items-center justify-center w-screen min-h-screen p-2">
                        <div className="w-3/4">
                            <div className="flex flex-row w-full gap-x-12">
                                <div className="justify-start text-left w-3/4">
                                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 ">
                                        Your Courses
                                    </h2>
                                    <p className="mt-3 text-lg pb-8 leading-8 text-gray-600">
                                        You currently have {courses.length} courses on
                                        your list. Your account token balance is [...]
                                    </p>
                                </div>
                                <div className="p-4 place-content-center items-center w-1/4">
                                    <AddCourse updateRender={updateRender} />
                                </div>
                            </div>
                            <div className="pt-2 pb-4 overflow-scroll px-4 rounded-lg border border-gray-200 shadow-md">
                                {courses.length === 0 ? (
                                    <p className="p-32 text-xl">
                                        There are no courses on your snipe list. Add a
                                        course to get started!
                                    </p>
                                ) : (
                                    <table className="w-full min-w-max table-auto text-left border-separate border-spacing-y-4">
                                        <thead>
                                            <tr>
                                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-4 py-4 w-1/2">
                                                    <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                                                        Course
                                                    </p>
                                                </th>
                                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-4 py-4">
                                                    <p className="block antialiased text-center font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                                                        Index
                                                    </p>
                                                </th>
                                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-4 py-4">
                                                    <p className="block antialiased text-center font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                                                        Section
                                                    </p>
                                                </th>
                                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-4 py-4">
                                                    <p className="block antialiased text-center font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                                                        Status
                                                    </p>
                                                </th>
                                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-4 py-4">
                                                    <p className="block antialiased text-center font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                                                        Action
                                                    </p>
                                                </th>

                                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-4 py-4">
                                                    <p className="block antialiased text-center font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70"></p>
                                                </th>
                                            </tr>
                                        </thead>
                                        {courses.map((course) => (
                                            <tbody key={course.id}>
                                                <CourseRow
                                                    course={course}
                                                    status="1"
                                                    updateRender={updateRender}
                                                />
                                            </tbody>
                                        ))}
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};
