import React, { useEffect, useState } from "react";
import { TimeInput, DateInput } from "@mantine/dates";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export const Settings = () => {
    const [newUsername, setUsername] = useState("");
    const [newEmail, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        smsNotifications: false,
    });
    const [newTime, setTime] = useState("18:00"); // Default to 6:00 PM
    const [RUID, setRUID] = useState("");
    const [birthday, setBirthday] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        const username = localStorage.getItem("username");
        await axios
            .post("http://localhost:3000/api/get_data", { username })
            .then((response) => {
                setPreferences(response.data.preferences);
                setTime(response.data.restartTime);
                setRUID(response.data.RUID);
                const PAC = response.data.PAC;
                if (PAC != "") {
                    const month = PAC.substring(0, 2) - 1;
                    const day = PAC.substring(2, 4);
                    const year = new Date().getFullYear();
                    const date = new Date(year, month, day);
                    setBirthday(date);
                }
            })
            .catch((err) => console.log(`Error fetching courses: ${err}`))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateTime(newTime)) {
            return;
        }

        const currentUsername = localStorage.getItem("username");
        const userData = {
            currentUsername,
            newUsername,
            newEmail,
            currentPassword,
            newPassword,
            preferences,
            newTime,
            RUID,
            PAC: birthday,
        };

        if (RUID != "" && RUID.match(/^[/\d]{9}?$/) == null) {
            alert("Please enter your 9-digit RUID.");
            return;
        }

        if (birthday != "") {
            const date = new Date(birthday);
            let month = date.getMonth() + 1;
            month = month < 10 ? "0" + month : "" + month;
            let day = date.getDate();
            day = day < 10 ? "0" + day : "" + day;
            userData.PAC = month + day;
        }

        await axios
            .post("http://localhost:3000/settings", userData)
            .then((result) => {
                if (result.data === "Incorrect password") {
                    alert(
                        "Incorrect password, type in your correct current password"
                    );
                }

                if (result.data === "Success") {
                    alert("Successfully updated your info!");
                }
            })
            .catch((err) => console.log(err));
    };

    const handlePreferenceChange = (e) => {
        const { name, checked } = e.target;
        setPreferences((prev) => ({ ...prev, [name]: checked }));
        console.log(preferences);
    };

    const validateTime = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const selectedTime = hours * 60 + minutes;
        const minTime = 6 * 60; // 6:00 AM in minutes
        const maxTime = 2 * 60; // 2:00 AM in minutes

        if (selectedTime <= minTime && selectedTime >= maxTime) {
            return false;
        }

        return true;
    };

    const changeTime = (e) => {
        const time = e.target.value;
        if (!validateTime(time)) {
            setError("Enter a time after 6:00 AM and before 2:00 AM");
        } else {
            setError("");
        }
        setTime(time);
    };

    return (
        <main className="settings">
            <Link to="/dashboard">
                <button className="absolute top-10 left-10">Dashboard</button>
            </Link>
            {!loading && (
                <div className="flex items-center justify-center text-center w-96 bg-gray-100">
                    <div className="lg:w-3/4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            Settings
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="username"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Change Username:
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={newUsername}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    placeholder="Enter new username"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Change Email:
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={newEmail}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter new email"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="currentPassword"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Current Password:
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                    placeholder="Enter current password"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="newPassword"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    New Password:
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    placeholder="Enter new password"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    RUID:
                                </label>
                                <input
                                    type="text"
                                    id="ruid"
                                    value={RUID}
                                    onChange={(e) => setRUID(e.target.value)}
                                    placeholder="Enter your RUID"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Preferences:
                                </label>
                                <div className="flex justify-center items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id="smsNotifications"
                                        name="smsNotifications"
                                        checked={preferences.smsNotifications}
                                        onChange={handlePreferenceChange}
                                        className="mr-2 leading-tight"
                                    />
                                    <label
                                        htmlFor="smsNotifications"
                                        className="text-gray-700 text-sm"
                                    >
                                        SMS Notifications
                                    </label>
                                </div>
                                <div className="flex justify-center items-center">
                                    <input
                                        type="checkbox"
                                        id="emailNotifications"
                                        name="emailNotifications"
                                        checked={preferences.emailNotifications}
                                        onChange={handlePreferenceChange}
                                        className="mr-2 leading-tight"
                                    />
                                    <label
                                        htmlFor="emailNotifications"
                                        className="text-gray-700 text-sm"
                                    >
                                        Email Notifications
                                    </label>
                                </div>
                                <br />
                                <div>
                                    <DateInput
                                        label="Birthday"
                                        placeholder="Enter your birthday"
                                        valueFormat="MM/DD"
                                        value={birthday}
                                        onChange={setBirthday}
                                    />
                                </div>
                                <br />
                                <div>
                                    <TimeInput
                                        label="Daily restart time"
                                        value={newTime}
                                        onChange={changeTime}
                                        error={error}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center items-center">
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};
