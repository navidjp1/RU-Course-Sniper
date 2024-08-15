import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext/authContext";
import axios from "axios";
import Header from "../components/Header";
import SettingsInput from "../components/SettingsInput";
import { updateUserDetails } from "../firebase/auth";

export const Settings = () => {
    const { currentUser } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [RUID, setRUID] = useState("");
    const [PAC, setPAC] = useState("");
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
        fetchUserData();
    }, []);

    // useEffect(() => {
    //     console.log("RUID OR PAC CHANGED");
    // }, [RUID, PAC]);

    const deleteCredentials = async (event) => {};

    const handleAccountDetails = async (event) => {
        event.preventDefault();

        const currentUsername = currentUser.displayName;
        const currentEmail = currentUser.email;

        if (username === currentUsername && email === currentEmail && password === "") {
            alert("No changes have been made");
            return;
        }

        await updateUserDetails(username, email, password);

        alert("Successfully updated your account details!");

        // const userData = {
        //     username,
        //     email,
        //     password,
        // };

        // console.log(userData);

        // if (RUID != "" && RUID.match(/^[/\d]{9}?$/) == null) {
        //     alert("Please enter your 9-digit RUID.");
        //     return;
        // }

        // await axios
        //     .post("http://localhost:3000/settings", userData)
        //     .then((result) => {
        //         if (result.data === "Incorrect password") {
        //             alert("Incorrect password, type in your correct current password");
        //         }

        //         if (result.data === "Success") {
        //             alert("Successfully updated your info!");
        //         }
        //     })
        //     .catch((err) => console.log(err));
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
                                        onSubmit={handleAccountDetails}
                                    >
                                        <SettingsInput
                                            label="Username"
                                            type="username"
                                            value={username}
                                            setValue={setUsername}
                                            placeholder="Enter a username"
                                            hidden={false}
                                        />
                                        <SettingsInput
                                            label="Email"
                                            type="email"
                                            value={email}
                                            setValue={setEmail}
                                            placeholder="example@gmail.com"
                                            hidden={false}
                                        />
                                        <SettingsInput
                                            label="Password"
                                            type="password"
                                            value={password}
                                            setValue={setPassword}
                                            placeholder="Enter new password (at least 8 characters)"
                                            hidden={false}
                                        />

                                        <div className="pt-4">
                                            <button
                                                className="bg-gray-50 border font-bold border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                        <SettingsInput
                                            label="RUID"
                                            type="ruid"
                                            value={RUID}
                                            setValue={setRUID}
                                            placeholder="Enter your RUID (9 digits)"
                                            hidden={true}
                                        />
                                        <SettingsInput
                                            label="PAC"
                                            type="pac"
                                            value={PAC}
                                            setValue={setPAC}
                                            placeholder="Enter your PAC (4 digits)"
                                            hidden={true}
                                        />

                                        <div className="flex w-2/5 items-end ">
                                            <button
                                                className="bg-gray-50 border text-sm border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 hover:bg-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                type="submit"
                                                disabled={isSaving}
                                                onClick={deleteCredentials}
                                            >
                                                {isSaving
                                                    ? "Deleting..."
                                                    : "Delete Credentials"}
                                            </button>
                                        </div>

                                        <div className="">
                                            <button
                                                className="bg-gray-50 border font-bold border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
};
