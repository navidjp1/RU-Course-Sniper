import { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";
import { toast } from "sonner";
import axios from "axios";
import ConfirmModal from "./ConfirmModal";
import MultipleInputs from "./MultipleInputs";

const api_base_url = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

function AddCourseModal({ isOpen, onClose, updateRender, tokenBalance }) {
    const { currentUser } = useAuth();
    const [courseID, setCourseID] = useState("");
    const [dropIDs, setDropIDs] = useState([]);
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

        if (tokenBalance < 1) {
            toast.error("You do not have enough tokens to add a course.");
            return;
        }

        if (courseID.match(/^[/\d]{5}?$/) == null) {
            toast.error("Please enter a valid 5-digit course index.");
            return;
        }

        setIsConfirmModalOpen(true);
    };

    const checkIfDuplicate = async () => {
        try {
            await axios.get(`${api_base_url}/api/courses/${courseID}`);

            addCourseToDB();
        } catch (error) {
            if (error.response.status === 404) {
                // console.log(error.response.data.message);
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
    };

    const addCourseToDB = async () => {
        const uid = currentUser.uid;

        const userData = { uid, dropIDs };

        try {
            const response = await axios.post(
                `${api_base_url}/api/courses/add/${courseID}`,
                userData
            );

            updateRender();
            toast.success(response.data.message);
            resetFormValues();
        } catch (error) {
            if (error.response.status === 400) {
                toast.error("You are already sniping this course");
            } else {
                console.error(
                    `Error updating user creds: ${error.response.data.message}`
                );
                toast.error("There was an error in the system. Try again later.");
            }
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
        <main className="add-course-modal text-platinum">
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex justify-center pt-16 bg-black bg-opacity-50"
                    onClick={handleBackdropClick}
                >
                    <div
                        className={`flex items-center justify-center flex-col bg-rich-black p-6 h-fit w-2/5 rounded shadow-md fade-in`}
                        onClick={handleModalContentClick}
                    >
                        <h2 className="mb-2 text-xl font-semibold ">Add Course</h2>
                        <p className="mb-6 text-md">
                            Enter the details for the course you want to snipe.
                        </p>

                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="flex flex-col justify-between">
                                <label
                                    htmlFor="courseID"
                                    className="flex justify-center mb-2 text-sm font-medium "
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
                                        className={`justify-center items-center text-center rounded-lg w-2/5 p-2.5  border-gray-600 outline-none mb-2 placeholder-midnight-green text-rich-black bg-platinum`}
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
                                    className="flex justify-start mb-2 text-sm font-medium text-left "
                                >
                                    Courses to Drop (optional)
                                </label>
                                <MultipleInputs inputs={dropIDs} setInputs={setDropIDs} />
                            </div>
                            <div className="flex justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="justify-start w-1/4 px-4 py-2 bg-gray-500 rounded hover:bg-red-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`justify-end w-1/4 px-4 py-2  bg-midnight-green rounded  ${
                                        tokenBalance < 1
                                            ? "hover:cursor-not-allowed hover:bg-red-500"
                                            : "hover:bg-blue-munsell"
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
