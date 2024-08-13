import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext/authContext";
import axios from "axios";
import Header from "./Header";
function TestComponent() {
    const { currentUser } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [RUID, setRUID] = useState("");
    const [PAC, setPAC] = useState("");
    const [hideRUID, setHideRUID] = useState(true);
    const [hidePAC, setHidePAC] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        const username = currentUser.displayName;
        const email = currentUser.email;
        setUsername(username);
        setEmail(email);

        await axios
            .post("http://localhost:3000/api/get_data", { username })
            .then((response) => {
                setRUID(response.data.RUID);
                setPAC(response.data.PAC);
            })
            .catch((err) => console.log(`Error fetching courses: ${err}`))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        console.log("FETCHING DATA...");
        fetchUserData();
    }, []);

    // useEffect(() => {
    //     console.log("RUID OR PAC CHANGED");
    // }, [RUID, PAC]);

    const changeAccountDetails = async (event) => {
        event.preventDefault();

        const currentUsername = currentUser.displayName;

        const userData = {
            currentUsername,
            newUsername,
            newEmail,
            currentPassword,
            newPassword,
        };

        if (RUID != "" && RUID.match(/^[/\d]{9}?$/) == null) {
            alert("Please enter your 9-digit RUID.");
            return;
        }

        await axios
            .post("http://localhost:3000/settings", userData)
            .then((result) => {
                if (result.data === "Incorrect password") {
                    alert("Incorrect password, type in your correct current password");
                }

                if (result.data === "Success") {
                    alert("Successfully updated your info!");
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="bg-white w-screen min-h-screen">
            <Header pageNum={3} />
            {!loading && (
                <div className="flex  justify-center py-20 px-12 gap-x-4">
                    <div className="pt-2 pb-4 w-2/5 overflow-scroll rounded-lg border border-gray-200 shadow-md bg-white">
                        <div className="flex flex-col items-center p-4 ">
                            <div className="w-full  bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                <div className="space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className="text-xl pb-4 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                        Account Details
                                    </h1>

                                    <form
                                        className="space-y-4 md:space-y-6"
                                        // onSubmit={handleSubmit}
                                    >
                                        <div>
                                            <label
                                                htmlFor="username"
                                                className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                value={username}
                                                onChange={(e) =>
                                                    setUsername(e.target.value)
                                                }
                                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="Enter a username"
                                                required=""
                                            ></input>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="example@gmail.com"
                                                required=""
                                            ></input>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                                            >
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                id="password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                placeholder="Enter new password (at least 8 characters)"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                required=""
                                            ></input>
                                        </div>
                                        <div className="pt-4">
                                            <button
                                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                type="submit"
                                                disabled={isSaving}
                                            >
                                                {isSaving ? "Saving..." : "Save"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-2 pb-4 w-2/5 overflow-scroll rounded-lg border border-gray-200 shadow-md bg-white">
                        <div className="flex flex-col items-center p-4">
                            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                <div className="space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className="text-xl pb-4 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                        Credentials
                                    </h1>

                                    <form
                                        className="space-y-4 md:space-y-6"
                                        // onSubmit={handleSubmit}
                                    >
                                        <div>
                                            <label
                                                htmlFor="ruid"
                                                className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                RUID
                                            </label>
                                            <div className="flex flex-row bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-bl">
                                                <input
                                                    type={hideRUID ? "text" : "password"}
                                                    name="ruid"
                                                    id="ruid9"
                                                    value={RUID}
                                                    onChange={(e) =>
                                                        setRUID(e.target.value)
                                                    }
                                                    className="bg-transparent justify-start w-full"
                                                    placeholder="Enter your RUID (9 digits)"
                                                    required=""
                                                />
                                                <button
                                                    className="justify-end hover:cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setHideRUID(!hideRUID);
                                                    }}
                                                >
                                                    {hideRUID ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="size-6 text-red-500"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="size-6"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="pac"
                                                className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                PAC
                                            </label>
                                            <div className="flex flex-row bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-bl">
                                                <input
                                                    type={hidePAC ? "text" : "password"}
                                                    name="pac"
                                                    id="pac"
                                                    value={PAC}
                                                    onChange={(e) =>
                                                        setPAC(e.target.value)
                                                    }
                                                    className="bg-transparent justify-start w-full"
                                                    placeholder="Enter your PAC (4 digits, usually your birthday in MMDD format)"
                                                    required=""
                                                />
                                                <button
                                                    className="justify-end hover:cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setHidePAC(!hidePAC);
                                                    }}
                                                >
                                                    {hidePAC ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="size-6 text-red-500"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="size-6"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                            />
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                            />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                type="submit"
                                                disabled={isSaving}
                                            >
                                                {isSaving
                                                    ? "Verifying..."
                                                    : "Verify Login"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TestComponent;
