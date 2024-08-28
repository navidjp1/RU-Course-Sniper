import axios from "axios";
import { Trash2 } from "react-feather";
import { useAuth } from "../contexts/authContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ConfirmModal from "./ConfirmModal";
const DeleteCourse = ({ updateRender, course, isSniperRunning }) => {
    const { currentUser } = useAuth();
    const [disabled, setDisabled] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = async (e) => {
            if (e.key === "Enter" && isConfirmModalOpen) {
                deleteCourse();
            }
            if (e.key === "Escape" && isConfirmModalOpen) {
                setDisabled(false);
                setIsConfirmModalOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isConfirmModalOpen]);

    const deleteCourse = async () => {
        const uid = currentUser.uid;

        try {
            const response = await axios.post(
                "http://localhost:3000/api/courses/remove/",
                { uid, course }
            );

            if (response.status !== 200) throw new Error(response.data);
            updateRender();
            toast.success("Successfully removed course!");
        } catch (error) {
            console.error(`Error removing course: ${error}`);
            toast.error("There was an error in the system. Try again later.");
        }

        setIsConfirmModalOpen(false);
    };

    return (
        <div className="relative font-sans font-medium text-center align-middle transition-all select-none place-content-center ">
            <button
                className={`disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs ${
                    isSniperRunning ? "hover:cursor-not-allowed" : "hover:text-red-500"
                }`}
                onClick={(e) => {
                    e.preventDefault();
                    if (isSniperRunning) {
                        toast.error("Cannot delete courses while sniping.");
                    } else {
                        setDisabled(true);
                        setIsConfirmModalOpen(true);
                    }
                }}
                disabled={disabled}
            >
                <Trash2 />
            </button>
            <div>
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => {
                        setDisabled(false);
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
