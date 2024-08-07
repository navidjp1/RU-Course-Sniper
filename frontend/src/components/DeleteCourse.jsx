import axios from "axios";
import { Trash2 } from "react-feather";
import { useAuth } from "../contexts/authContext/authContext";
const DeleteCourse = ({ updateRender, courseID }) => {
    const { currentUser } = useAuth();
    const handleSubmit = async (event) => {
        event.preventDefault();

        const userConfirm = confirm("Are you sure you want to delete this course?");

        if (!userConfirm) return;

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
