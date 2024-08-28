import React from "react";
import Header from "../components/Header";
import AddCourseModal from "../components/AddCourseModal";
import { CourseRow, CourseTitle } from "../components/CourseTable";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { fetchUserData } from "../api/fetchData";
import { callStartSniper, callStopSniper } from "../api/handleSniper";
import { toast } from "sonner";

export const Dashboard = () => {
    const { currentUser } = useAuth();
    const uid = currentUser.uid;
    const [courses, setCourses] = useState({});
    const [tokenBalance, setTokenBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isSniperRunning, setIsSniperRunning] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

    const fetchData = async () => {
        const { courses, userTokenBalance, isSniping } = await fetchUserData(uid);
        if (courses === "") return;

        setCourses(courses);
        setTokenBalance(userTokenBalance);
        setIsSniperRunning(isSniping);

        if (courses.length === 0 && userTokenBalance === 0) {
            setDisabled(true);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateRender = () => {
        fetchData(); // Trigger useEffect to refetch courses
    };

    const handleSniper = async (event) => {
        event.preventDefault();

        setDisabled(true);

        if (isSniperRunning) {
            const res = await callStopSniper(uid);
            if (res.status === 200) setIsSniperRunning(false);
        } else {
            const res = await callStartSniper(uid);
            if (res.status === 200) setIsSniperRunning(true);
        }

        updateRender();

        setDisabled(false);
    };

    return (
        <main className="bg-white">
            {!loading && (
                <div className="bg-white ">
                    <Header pageNum={1} />
                    <div className="flex flex-col items-center w-screen min-h-screen p-2 pt-24">
                        <div className="w-3/4">
                            <div className="flex flex-row w-full gap-x-12">
                                <div className="justify-start w-3/5 text-left">
                                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 ">
                                        Your Courses
                                    </h2>
                                    <p className="pb-8 mt-3 text-lg leading-8 text-gray-600">
                                        You currently have {courses.length} courses on
                                        your list. Your account token balance is{" "}
                                        {tokenBalance}.
                                    </p>
                                </div>
                                <div className="flex flex-row items-center w-2/5 p-4 place-content-center gap-x-4">
                                    <button
                                        className={`w-48 h-12 p-1 font-sans text-xl font-bold text-center text-white border rounded-md outline-none border-blue-gray-50 ${
                                            disabled
                                                ? "hover:cursor-not-allowed hover:bg-red-500"
                                                : isSniperRunning
                                                ? "bg-red-500 hover:bg-red-800"
                                                : "bg-blue-500 hover:bg-blue-800"
                                        }`}
                                        onClick={(e) => handleSniper(e)}
                                        type="button"
                                        disabled={disabled}
                                    >
                                        {!isSniperRunning ? "Start" : "Stop"} Sniping
                                    </button>
                                    <button
                                        className={`w-48 h-12 p-1 font-sans text-xl font-bold text-center text-white bg-blue-500 border rounded-md outline-none hover:bg-blue-800 border-blue-gray-50 ${
                                            isSniperRunning
                                                ? "hover:cursor-not-allowed hover:bg-red-500"
                                                : "hover:bg-blue-800"
                                        }`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (isSniperRunning) {
                                                toast.error(
                                                    "Cannot add course while sniping"
                                                );
                                            } else setIsCourseModalOpen(true);
                                        }}
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
                                                    thStyles={"w-3/5"}
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
                                                    updateRender={updateRender}
                                                    isSniperRunning={isSniperRunning}
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
