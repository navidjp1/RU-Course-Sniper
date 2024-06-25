import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal";

const AddCourse = () => {
    const [courseIdx, setIdx] = useState("");
    const [campus, setCampus] = useState("New Brunswick");
    const [semester, setSemester] = useState("Spring");
    const [year, setYear] = useState("2024");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (courseIdx == " ") {
            //regex
            alert("Please enter a valid 5-digit course index.");
            return;
        }

        const userData = { courseIdx, campus, semester, year };

        await axios
            .post("http://localhost:3000/dashboard", userData)
            .then((result) => {
                console.log(result);
                if (result.data === "Success") {
                    setOpen(false); // Close the modal
                    setIdx("");
                    setCampus("New Brunswick");
                    setSemester("Spring");
                    setYear("2024");
                    navigate("/dashboard");
                }
            })
            .catch((err) => console.log(err))
            .finally(() => {});
    };

    const [open, setOpen] = useState(false);
    return (
        <>
            <button className="btn btn-danger" onClick={() => setOpen(true)}>
                Add
            </button>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="text-center w-96">
                    <div className="mx-auto my-4 w-96">
                        <h3 className="text-lg font-black text-gray-800">
                            Add Course
                        </h3>
                        <p className="text-sm text-gray-500">
                            Enter the details for the course you want to snipe.
                        </p>
                        <br />
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Course Index:
                                </label>
                                <input
                                    type="text"
                                    id="courseIndex"
                                    value={courseIdx}
                                    onChange={(e) => setIdx(e.target.value)}
                                    placeholder="Enter course index (5 digits)"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Campus:
                                </label>
                                <select
                                    name="campus"
                                    value={campus}
                                    onChange={(e) => setCampus(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option>New Brunswick</option>
                                    <option>Newark</option>
                                    <option>Camden</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Semester:
                                </label>
                                <select
                                    name="semester"
                                    value={semester}
                                    onChange={(e) =>
                                        setSemester(e.target.value)
                                    }
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option>Spring</option>
                                    <option>Summer</option>
                                    <option>Fall</option>
                                    <option>Winter</option>
                                </select>
                            </div>
                            <div className="mb-8">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Year:
                                </label>
                                <select
                                    name="year"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option>2024</option>
                                    <option>2025</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="btn btn-danger w-full"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                        <br />
                        <button
                            className="btn btn-light w-full"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AddCourse;
