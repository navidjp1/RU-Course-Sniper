import { useState, useEffect } from "react";
import MultipleInputs from "./MultipleInputs";
import { updateDropIDs } from "../api/updateData";
import { toast } from "sonner";
import { useAuth } from "../contexts/authContext";

function EditCoursesToDrop({ courseID, currentDropIDs, isSniperRunning }) {
    const { currentUser } = useAuth();
    const uid = currentUser.uid;
    const [editing, setEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dropIDs, setDropIDs] = useState(currentDropIDs);
    const [newDropIDs, setNewDropIDs] = useState(currentDropIDs);

    const toggleEditOn = () => {
        if (isSniperRunning) {
            toast.error("Cannot edit courses to drop while sniping.");
        } else {
            setEditing(true);
            setIsModalOpen(true);
        }
    };

    const toggleEditOff = () => {
        setIsModalOpen(false);
        setEditing(false);
        setNewDropIDs(currentDropIDs);
    };

    const handleBackdropClick = () => {
        setIsModalOpen(false);
    };

    const handleModalContentClick = (event) => {
        event.stopPropagation();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            toggleEditOff();
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isModalOpen]);

    const handleChangingDropIDs = async (e) => {
        e.preventDefault();

        if (newDropIDs === currentDropIDs) {
            toast.error("No changes have been made");
            return;
        }

        const response = await updateDropIDs(uid, courseID, newDropIDs);

        if (response.status === 200) {
            toast.success(
                "Successfully updated the courses to drop for course index " + courseID
            );
            setDropIDs(newDropIDs);
        }
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex flex-row justify-between">
                <p className="block text-sm antialiased font-normal leading-normal text-blue-gray-900 opacity-70">
                    {dropIDs.length !== 0
                        ? `Courses to Drop: ${dropIDs.join(", ")}`
                        : "Courses to Drop: N/A"}
                </p>

                <button
                    className="justify-end pl-2 border-transparent outline-none hover:cursor-pointer"
                    onClick={toggleEditOn}
                    type="button"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`size-4  ${
                            editing
                                ? "text-blue-600"
                                : isSniperRunning
                                ? "hover:cursor-not-allowed"
                                : "hover:text-blue-600"
                        }`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                    </svg>
                </button>
            </div>
            <main className="password-modal">
                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex justify-center pt-8 bg-black bg-opacity-50"
                        onClick={handleBackdropClick}
                    >
                        <div
                            className={`flex items-center justify-center flex-col bg-white p-6 h-fit w-2/5 rounded shadow-md fade-in`}
                            onClick={handleModalContentClick}
                        >
                            <h2 className="mb-10 text-lg font-semibold text-center">
                                Edit the courses you want to drop <br /> In order to snipe
                                course index: {courseID}
                            </h2>
                            <div className="w-full">
                                <MultipleInputs
                                    inputs={newDropIDs}
                                    setInputs={setNewDropIDs}
                                />

                                <div className="flex justify-between w-full">
                                    <button
                                        type="button"
                                        onClick={() => toggleEditOff()}
                                        className="justify-start px-4 py-2 text-white bg-gray-500 rounded hover:bg-red-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="justify-end px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-800"
                                        onClick={(e) => handleChangingDropIDs(e)}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default EditCoursesToDrop;
