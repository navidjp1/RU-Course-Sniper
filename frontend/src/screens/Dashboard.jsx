import React from "react";
import Header from "../components/Header";
import AddCourseModal from "../components/AddCourseModal";
import { CourseRow, CourseTitle } from "../components/CourseTable";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { fetchUserData } from "../api/fetchData";
import { callStartSniper, callStopSniper } from "../api/handleSniper";

export const Dashboard = () => {
    const { currentUser } = useAuth();
    const uid = currentUser.uid;
    const [courses, setCourses] = useState({});
    const [tokenBalance, setTokenBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

    const fetchData = async () => {
        const { courses, userTokenBalance } = await fetchUserData(uid);
        if (courses === "" || userTokenBalance === "") return;
        setCourses(courses);
        setTokenBalance(userTokenBalance);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateRender = () => {
        fetchData(); // Trigger useEffect to refetch courses
    };

    const handleStart = async (event) => {
        event.preventDefault();

        setDisabled(true);

        const res = await callStartSniper(uid);

        setDisabled(false);
    };

    const handleStop = async (event) => {
        event.preventDefault();

        setDisabled(false);

        const res = await callStopSniper();

        if (res.status !== 200) setDisabled(true);
    };

    return (
        <main className="bg-white">
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
                                        your list. Your account token balance is{" "}
                                        {tokenBalance}.
                                    </p>
                                </div>
                                <div className="items-center w-1/4 p-4 place-content-center">
                                    <button
                                        className="w-48 h-12 p-1 font-sans text-xl font-bold text-center text-white bg-blue-500 border rounded-md outline-none hover:bg-blue-800 border-blue-gray-50"
                                        onClick={() => setIsCourseModalOpen(true)}
                                    >
                                        Add Course
                                    </button>
                                    <AddCourseModal
                                        isOpen={isCourseModalOpen}
                                        onClose={() => setIsCourseModalOpen(false)}
                                        updateRender={updateRender}
                                        tokenBalance={tokenBalance}
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
                                                    status={1}
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
