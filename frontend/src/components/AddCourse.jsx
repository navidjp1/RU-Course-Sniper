import { useState } from "react";
import { useAuth } from "../contexts/authContext/authContext";
import { toast } from "sonner";
import axios from "axios";
import Modal from "./Modal";
import ConfirmModal from "./ConfirmModal";

const AddCourse = ({ updateRender }) => {
    const { currentUser } = useAuth();
    const [courseID, setID] = useState("");
    const [dropIDs, setDropIDs] = useState("");
    const [campus, setCampus] = useState("New Brunswick");
    const [semester, setSemester] = useState("Spring");
    const [year, setYear] = useState("2024");
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDupeModalOpen, setIsDupeModalOpen] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (courseID.match(/^[/\d]{5}?$/) == null) {
            toast.error("Please enter a valid 5-digit course index.");
            return;
        }

        if (dropIDs !== "") {
            const dropIDArray = dropIDs.split(",").map(function (id) {
                return id.trim();
            });
            for (const dropID of dropIDArray) {
                if (dropID.match(/^[/\d]{5}?$/) == null) {
                    toast.error("Please enter a valid 5-digit course index.");
                    return;
                }
            }
        }

        setIsConfirmModalOpen(true);
    };

    const checkIfDuplicate = async () => {
        try {
            const response = await axios.post("http://localhost:3000/api/check_course", {
                courseID,
            });
            if (response.data === "Course not in DB") {
                setIsDupeModalOpen(true);
            } else {
                addCourseToDB();
            }
        } catch (error) {
            console.log(err);
        }
        setIsConfirmModalOpen(false);
    };

    const addCourseToDB = async () => {
        const username = currentUser.displayName;
        const dropIDArray = dropIDs.split(",").map(function (id) {
            return id.trim();
        });
        const userData = { username, courseID, dropIDArray, campus, semester, year };

        await axios
            .post("http://localhost:3000/api/add", userData)
            .then((result) => {
                if (result.data === "Success") {
                    updateRender();
                    setOpen(false); // Close the modal
                    toast.success("Successfully added course");
                } else if (result.data === "Duplicate") {
                    toast.error("You are already sniping this course");
                } else {
                    console.log("Error: " + result.data);
                }
                setID("");
                setDropIDs("");
                setCampus("New Brunswick");
                setSemester("Spring");
                setYear("2024");
            })
            .catch((err) => console.log(err));
    };

    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                className="w-48 h-12 p-1 font-sans text-xl font-bold text-center text-white bg-blue-500 border rounded-md border-blue-gray-50"
                onClick={() => setOpen(true)}
            >
                Add Course
            </button>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-96">
                    <div className="mx-auto my-4 w-96">
                        <h3 className="text-lg font-black text-gray-800">Add Course</h3>
                        <p className="text-sm text-gray-500">
                            Enter the details for the course you want to snipe.
                        </p>
                        <br />
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-bold text-gray-700">
                                    Course Index:
                                </label>
                                <input
                                    type="text"
                                    id="courseIndex"
                                    autoComplete="off"
                                    value={courseID}
                                    onChange={(e) => setID(e.target.value)}
                                    placeholder="Enter course index (5 digits)"
                                    className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-bold text-gray-700">
                                    Campus:
                                </label>
                                <select
                                    name="campus"
                                    value={campus}
                                    onChange={(e) => setCampus(e.target.value)}
                                    className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                >
                                    <option>New Brunswick</option>
                                    <option>Newark</option>
                                    <option>Camden</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-bold text-gray-700">
                                    Semester:
                                </label>
                                <select
                                    name="semester"
                                    value={semester}
                                    onChange={(e) => setSemester(e.target.value)}
                                    className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                >
                                    <option>Spring</option>
                                    <option>Summer</option>
                                    <option>Fall</option>
                                    <option>Winter</option>
                                </select>
                            </div>
                            <div className="mb-8">
                                <label className="block mb-2 text-sm font-bold text-gray-700">
                                    Year:
                                </label>
                                <select
                                    name="year"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                >
                                    <option>2024</option>
                                    <option>2025</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-bold text-gray-700">
                                    Courses to Drop (optional):
                                </label>
                                <input
                                    type="text"
                                    id="dropCourses"
                                    autoComplete="off"
                                    value={dropIDs}
                                    onChange={(e) => setDropIDs(e.target.value)}
                                    placeholder="Enter course indices to drop separated by commas"
                                    className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="w-full btn btn-danger">
                                    Add
                                </button>
                            </div>
                        </form>
                        <br />
                        <button
                            className="w-full btn btn-light"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
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
                    onConfirm={() => {
                        setIsDupeModalOpen(false);
                        addCourseToDB();
                    }}
                    message="This course was not found. Are you sure you entered in the right index number? Click 'Confirm' to add the course regardless."
                />
            </div>
        </>
    );
};

export default AddCourse;
