import axios from "axios";
import { Trash2 } from "react-feather";

const DeleteCourse = ({ updateRender, courseID }) => {
    const handleSubmit = async (event) => {
        event.preventDefault();

        const userConfirm = confirm(
            "Are you sure you want to delete this course?"
        );

        if (!userConfirm) return;

        const username = localStorage.getItem("username");
        const userData = { username, courseID };

        await axios
            .post("http://localhost:3000/api/delete", userData)
            .then((result) => {
                if (result.data === "Success") {
                    updateRender();
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            <button
                onClick={handleSubmit}
                className="absolute top-2 right-2 ml-4 p-3 rounded-lg text-gray-400 bg-white hover:bg-gray-50 hover:text-gray-600"
            >
                <Trash2 />
            </button>
        </>
    );
};

export default DeleteCourse;
