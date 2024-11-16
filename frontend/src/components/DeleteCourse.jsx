import axios from "axios";
import { Trash2 } from "react-feather";
import { useAuth } from "../contexts/authContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ConfirmModal from "./ConfirmModal";

const api_base_url = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const DeleteCourse = ({ updateRender, course, isSniperRunning }) => {
    const { currentUser } = useAuth();
    const [disabled, setDisabled] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = async (e) => {
            if (e.key === "Enter" && isConfirmModalOpen && !disabled) {
                deleteCourse();
            }
            if (e.key === "Escape" && isConfirmModalOpen) {
                setIsConfirmModalOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isConfirmModalOpen]);

    const deleteCourse = async () => {
        setDisabled(true);
        const uid = currentUser.uid;

        try {
            const response = await axios.post(`${api_base_url}/api/courses/remove/`, {
                uid,
                course,
            });

            if (response.status !== 200) throw new Error(response.data);
            updateRender();
            toast.success("Successfully removed course!");
        } catch (error) {
            console.error(`Error removing course: ${error}`);
            toast.error("There was an error in the system. Try again later.");
        }

        setIsConfirmModalOpen(false);
        setDisabled(true);
    };

    return (
        <div className="relative font-medium text-center align-middle transition-all select-none place-content-center ">
            <button
                className={`disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none rounded-lg text-xs ${
                    isSniperRunning ? "hover:cursor-not-allowed" : "hover:text-red-500"
                }`}
                onClick={(e) => {
                    e.preventDefault();
                    if (isSniperRunning) {
                        toast.error("Cannot delete courses while sniping.");
                    } else {
                        setIsConfirmModalOpen(true);
                    }
                }}
                disabled={disabled}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="items-center justify-center size-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                </svg>
            </button>
            <div>
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => {
                        setIsConfirmModalOpen(false);
                    }}
                    onConfirm={async () => {
                        deleteCourse();
                    }}
                    message="Are you sure you want to delete this course? This action cannot be undone, but you will get refunded 1 token."
                />
            </div>
        </div>
    );
};

export default DeleteCourse;
