import React from "react";
import { CourseRow, CourseTitle } from "../components/CourseTable";
import Header from "../components/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCourseModal from "../components/AddCourseModal";
import { toast } from "sonner";
import { useAuth } from "../contexts/authContext/authContext";

export const Dashboard = () => {
    const { currentUser } = useAuth();
    const [courses, setCourses] = useState({});
    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
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
                    toast.success("Successfully started sniping your courses!");
                    return;
                }
                if (msg === "No cred") {
                    toast.warning(
                        "You have not entered in your required credentials in order to start sniping. Please do so at the settings page."
                    );
                } else if (msg === "Invalid login credentials") {
                    toast.error(
                        "Your login credentials did not work. Make sure you entered in your correct RUID and birthday in the settings page."
                    );
                } else if (msg === "Invalid drop IDs") {
                    toast.error(
                        "One or more of the courses you intend to drop are courses that you are not currently enrolled in. Please update them and try again."
                    );
                } else {
                    console.log(msg);
                    toast.warning("There was an error in the system. Try again later.");
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
                    toast.success("Successfully stopped sniping your courses!");
                } else {
                    console.log(msg);
                    toast.warning("There was an error in the system. Try again later.");
                    setDisabled(true);
                }
            })
            .catch((err) => {
                console.log(`Error starting sniper: ${err}`);
                setDisabled(true);
            });
    };

    return (
        <main className="dashboard">
            {!loading && (
                <div className="bg-white ">
                    <Header pageNum={1} />
                    <div className="flex flex-col items-center w-screen min-h-screen p-2 pt-24">
                        <div className="w-3/4">
                            <div className="flex flex-row w-full gap-x-12">
                                <div className="justify-start w-3/4 text-left">
                                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 ">
                                        Your Courses
                                    </h2>
                                    <p className="pb-8 mt-3 text-lg leading-8 text-gray-600">
                                        You currently have {courses.length} courses on
                                        your list. Your account token balance is [...]
                                    </p>
                                </div>
                                <div className="items-center w-1/4 p-4 place-content-center">
                                    <button
                                        className="w-48 h-12 p-1 font-sans text-xl font-bold text-center text-white bg-blue-500 border rounded-md border-blue-gray-50"
                                        onClick={() => setIsCourseModalOpen(true)}
                                    >
                                        Add Course
                                    </button>
                                    <AddCourseModal
                                        isOpen={isCourseModalOpen}
                                        onClose={() => setIsCourseModalOpen(false)}
                                        updateRender={updateRender}
                                    />
                                </div>
                            </div>
                            <div className="px-4 pt-2 pb-4 overflow-scroll border border-gray-200 rounded-lg shadow-md">
                                {courses.length === 0 ? (
                                    <p className="p-32 text-xl">
                                        There are no courses on your snipe list. Add a
                                        course to get started!
                                    </p>
                                ) : (
                                    <table className="w-full text-left border-separate table-auto min-w-max border-spacing-y-4">
                                        <thead>
                                            <tr>
                                                <CourseTitle
                                                    title="Course"
                                                    thStyles={"w-1/2"}
                                                />
                                                <CourseTitle
                                                    title="Index"
                                                    pStyles={"text-center"}
                                                />
                                                <CourseTitle
                                                    title="Section"
                                                    pStyles={"text-center"}
                                                />
                                                <CourseTitle
                                                    title="Status"
                                                    pStyles={"text-center"}
                                                />
                                                <CourseTitle
                                                    title="Action"
                                                    pStyles={"text-center"}
                                                />
                                                <CourseTitle
                                                    title=""
                                                    pStyles={"text-center"}
                                                />
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
