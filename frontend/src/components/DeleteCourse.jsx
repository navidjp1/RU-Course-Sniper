import axios from "axios";
import { Trash2 } from "react-feather";
import { useAuth } from "../contexts/authContext/authContext";
import { useState } from "react";
const DeleteCourse = ({ updateRender, courseID }) => {
    const { currentUser } = useAuth();
    const [disabled, setDisabled] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setDisabled(true);
        const userConfirm = confirm("Are you sure you want to delete this course?");

        if (!userConfirm) {
            setDisabled(false);
            return;
        }

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
    };

    return (
        <div className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all ">
            <button
                className="disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs hover:text-red-500 text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20"
                onClick={handleSubmit}
                disabled={disabled}
            >
                <span className="absolute  top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <Trash2 />
                </span>
            </button>
        </div>
    );
};

export default DeleteCourse;
