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
    const [hidden, setHidden] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

    const fetchData = async () => {
        const { courses, userTokenBalance, isSniping } = await fetchUserData(uid);
        if (courses === "") return;

        setCourses(courses);
        setTokenBalance(userTokenBalance);
        setIsSniperRunning(isSniping);

        if (courses.length === 0 && userTokenBalance === 0) {
            setHidden(true);
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
        <main className="bg-rich-black text-platinum">
            <Header pageNum={1} />
            {!loading && (
                <div className="bg-rich-black">
                    <div className="flex flex-col items-center w-screen min-h-screen p-2 pt-24">
                        <div className="w-3/4">
                            <div className="flex flex-row w-full gap-x-12">
                                <div className="justify-start w-3/5 text-left text-platinum">
                                    <h2 className="text-3xl font-bold tracking-tight ">
                                        Your Courses - Spring 2025
                                    </h2>
                                    <p className="pb-8 mt-3 text-lg leading-8">
                                        You currently have{" "}
                                        {courses.length == 0 ? "no" : courses.length}{" "}
                                        {courses.length == 1 ? "course" : "courses"} on
                                        your list. Your account token balance is{" "}
                                        {tokenBalance}.
                                    </p>
                                </div>
                                <div className="flex flex-row items-center w-2/5 lg:p-4 place-content-center gap-x-1 lg:gap-x-4">
                                    <button
                                        className={`w-48 h-12 lg:text-xl font-bold text-center text-rich-black  rounded-md outline-none ${
                                            hidden
                                                ? "bg-transparent border-transparent"
                                                : isSniperRunning
                                                ? "bg-red-500 hover:bg-red-800"
                                                : "bg-platinum hover:bg-midnight-green hover:text-platinum"
                                        }`}
                                        onClick={(e) => handleSniper(e)}
                                        type="button"
                                        disabled={disabled}
                                        hidden={hidden}
                                    >
                                        {!isSniperRunning ? "Start" : "Stop"} Sniping
                                    </button>
                                    <button
                                        className={`w-48 h-12 lg:text-xl font-bold text-center text-rich-black rounded-md outline-none bg-platinum  ${
                                            isSniperRunning
                                                ? "hover:cursor-not-allowed hover:bg-red-500"
                                                : "hover:bg-midnight-green hover:text-platinum"
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
                            <div className="px-4 pt-2 pb-4 border border-gray-200 rounded shadow-md bg-platinum">
                                {courses.length === 0 ? (
                                    <p className="p-32 text-xl font-semibold text-rich-black">
                                        There are no courses on your snipe list. Add a
                                        course to get started!
                                    </p>
                                ) : (
                                    <table className="w-full text-left border-separate table-auto min-w-max border-spacing-y-4">
                                        <thead className="">
                                            <tr>
                                                <CourseTitle
                                                    title="Course"
                                                    thStyles={"lg:w-3/5"}
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
                                            </tr>
                                        </thead>
                                        {courses.map((course) => (
                                            <tbody key={course.id} className="">
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
