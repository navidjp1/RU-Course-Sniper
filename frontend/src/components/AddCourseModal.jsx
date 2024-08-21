import { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { toast } from "sonner";
import axios from "axios";
import ConfirmModal from "./ConfirmModal";
import MultipleInputs from "./MultipleInputs";

function AddCourseModal({ isOpen, onClose, updateRender, tokenBalance }) {
    const { currentUser } = useAuth();
    const [courseID, setCourseID] = useState("");
    const [dropIDs, setDropIDs] = useState([]);
    const [campus, setCampus] = useState("New Brunswick");
    const [semester, setSemester] = useState("Spring");
    const [year, setYear] = useState("2024");
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDupeModalOpen, setIsDupeModalOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = async (e) => {
            if (e.key === "Enter") {
                if (isConfirmModalOpen) {
                    await checkIfDuplicate();
                    setIsConfirmModalOpen(false);
                } else if (isDupeModalOpen) {
                    await addCourseToDB();
                    setIsDupeModalOpen(false);
                }
            }
            if (e.key === "Escape") {
                if (isOpen && !isConfirmModalOpen && !isDupeModalOpen) {
                    await onClose();
                    resetFormValues();
                }
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, isConfirmModalOpen, isDupeModalOpen]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (courseID.match(/^[/\d]{5}?$/) == null) {
            toast.error("Please enter a valid 5-digit course index.");
            return;
        }

        setIsConfirmModalOpen(true);
    };

    const checkIfDuplicate = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/check_course", {
                courseID,
            });

            if (response.status !== 200) throw new Error(response);

            addCourseToDB();
        } catch (error) {
            if (error.response.status === 404) {
                setIsDupeModalOpen(true);
            } else {
                console.error(
                    `Error checking for course: ${error.response.data.message}`
                );
                toast.error("There was an error in the system. Try again later.");
            }
        }
    };

    const resetFormValues = () => {
        setCourseID("");
        setDropIDs([]);
        setCampus("New Brunswick");
        setSemester("Spring");
        setYear("2024");
    };

    const addCourseToDB = async () => {
        const uid = currentUser.uid;
        const userData = { uid, courseID, dropIDs, campus, semester, year };

        try {
            const response = await axios.post(
                "http://localhost:3000/api/add_course",
                userData
            );

            if (response.status === 500) throw new Error(response.data);

            if (response.status === 208) {
                toast.error("You are already sniping this course");
                return;
            }

            updateRender();
            toast.success("Successfully added course");
            resetFormValues();
        } catch (error) {
            console.error(`Error updating user creds: ${error}`);
            toast.error("There was an error in the system. Try again later.");
        }

        setIsConfirmModalOpen(false);
        setIsDupeModalOpen(false);
        onClose();
    };

    const handleBackdropClick = () => {
        onClose();
    };

    const handleModalContentClick = (event) => {
        event.stopPropagation();
    };

    return (
        <main className="add-course-modal">
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex justify-center pt-16 bg-black bg-opacity-50"
                    onClick={handleBackdropClick}
                >
                    <div
                        className={`flex items-center justify-center flex-col bg-gray-800 p-6 h-fit w-2/5 rounded shadow-md fade-in`}
                        onClick={handleModalContentClick}
                    >
                        <h2 className="mb-2 text-xl font-semibold text-white ">
                            Add Course
                        </h2>
                        <p className="mb-6 text-white text-md">
                            Enter the details for the course you want to snipe.
                        </p>

                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="flex flex-col justify-between">
                                <label
                                    htmlFor="courseID"
                                    className="flex justify-center mb-2 text-sm font-medium text-white"
                                >
                                    Course Index
                                </label>
                                <div className="flex justify-center w-full">
                                    <input
                                        type="text"
                                        name="courseID"
                                        id={courseID}
                                        value={courseID}
                                        onChange={(e) => setCourseID(e.target.value)}
                                        placeholder="Enter course index (5 digits)"
                                        className={`justify-center items-center text-center rounded-lg w-2/5 p-2.5 "bg-gray-700 border-gray-600 outline-none mb-2 placeholder-gray-400 text-white`}
                                        autoComplete="off"
                                        required=""
                                    ></input>
                                </div>
                                <p
                                    className={`mb-4 text-sm ${
                                        courseID.length > 5
                                            ? "text-red-500"
                                            : "text-transparent"
                                    }`}
                                >
                                    Index must be exactly 5 digits
                                </p>
                                <label
                                    htmlFor="dropIDs"
                                    className="flex justify-start mb-2 text-sm font-medium text-left text-white"
                                >
                                    Courses to Drop (optional)
                                </label>
                                <MultipleInputs inputs={dropIDs} setInputs={setDropIDs} />

                                <div className="flex flex-row justify-between gap-x-2">
                                    <div className="flex flex-col items-center justify-center w-1/3">
                                        <label
                                            htmlFor="semester"
                                            className="mb-2 text-sm font-medium text-white "
                                        >
                                            Semester
                                        </label>

                                        <select
                                            name="semester"
                                            id={semester}
                                            value={semester}
                                            onChange={(e) => setSemester(e.target.value)}
                                            className={`justify-start rounded-lg w-full p-2.5 appearance-none text-center "bg-gray-700 border-gray-600 outline-none mb-6 placeholder-gray-400 text-white `}
                                        >
                                            <option>Spring</option>
                                            <option>Summer</option>
                                            <option>Fall</option>
                                            <option>Winter</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col items-center justify-center w-1/3">
                                        <label
                                            htmlFor="year"
                                            className="mb-2 text-sm font-medium text-white "
                                        >
                                            Year
                                        </label>

                                        <select
                                            name="year"
                                            id={year}
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            className={`justify-start rounded-lg w-full p-2.5 text-center appearance-none "bg-gray-700 border-gray-600 outline-none mb-6 placeholder-gray-400 text-white `}
                                        >
                                            <option>2024</option>
                                            <option>2025</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col items-center justify-center w-1/3">
                                        <label
                                            htmlFor="campus"
                                            className="mb-2 text-sm font-medium text-white "
                                        >
                                            Campus
                                        </label>
                                        <select
                                            name="campus"
                                            id={campus}
                                            value={campus}
                                            onChange={(e) => setCampus(e.target.value)}
                                            className={`justify-start rounded-lg w-full p-2.5 text-center appearance-none "bg-gray-700 border-gray-600 outline-none mb-6 placeholder-gray-400 text-white `}
                                        >
                                            <option>New Brunswick</option>
                                            <option>Newark</option>
                                            <option>Camden</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="justify-start w-1/4 px-4 py-2 text-white bg-gray-500 rounded hover:bg-red-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={tokenBalance < 1}
                                    className={`justify-end w-1/4 px-4 py-2 text-white bg-blue-500 rounded  ${
                                        tokenBalance < 1
                                            ? "hover:cursor-not-allowed hover:bg-red-500"
                                            : "hover:bg-blue-800"
                                    }`}
                                >
                                    Add: 1 Token
                                </button>
                            </div>
                        </form>
                    </div>
                    <div>
                        <ConfirmModal
                            isOpen={isConfirmModalOpen}
                            onClose={() => setIsConfirmModalOpen(false)}
                            onConfirm={async () => {
                                await checkIfDuplicate();
                            }}
                            message="Are you sure you want to add this course?"
                        />
                    </div>
                    <div>
                        <ConfirmModal
                            isOpen={isDupeModalOpen}
                            onClose={() => setIsDupeModalOpen(false)}
                            onConfirm={async () => {
                                setIsDupeModalOpen(false);
                                await addCourseToDB();
                            }}
                            message="This course was not found. Are you sure you entered in the right index number? Click 'Confirm' to add the course regardless."
                        />
                    </div>
                </div>
            )}
        </main>
    );
}

export default AddCourseModal;
