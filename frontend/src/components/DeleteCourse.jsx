import axios from "axios";
import { Trash2 } from "react-feather";
import { useAuth } from "../contexts/authContext";
import { useState, useEffect } from "react";
import ConfirmModal from "./ConfirmModal";
const DeleteCourse = ({ updateRender, courseID }) => {
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
        const username = currentUser.displayName;
        const userData = { username, courseID };

        await axios
            .post("http://localhost:3000/api/delete", userData)
            .then((result) => {
                if (result.data === "Success") {
                    updateRender();
                } else {
                    console.log(result.data);
                }
            })
            .catch((err) => console.log(err));

        setIsConfirmModalOpen(false);
    };

    return (
        <div className="relative font-sans font-medium text-center align-middle transition-all select-none place-content-center ">
            <button
                className="disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs hover:text-red-500"
                onClick={(e) => {
                    e.preventDefault();
                    setDisabled(true);
                    setIsConfirmModalOpen(true);
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
                    message="Are you sure you want to delete this course?"
                />
            </div>
        </div>
    );
};

export default DeleteCourse;
