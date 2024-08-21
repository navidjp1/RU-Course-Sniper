import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { toast } from "sonner";
import Header from "../components/Header";
import SettingsInput from "../components/SettingsInput";
import { deleteAccount, updateUserDetails, linkGoogleWithEmail } from "../firebase/auth";
import { fetchUserCreds } from "../api/fetchData";
import { deleteCreds, deleteAccountFromDB } from "../api/deleteData";
import { updateCreds } from "../api/updateData";
import ConfirmModal from "../components/ConfirmModal";
import PasswordModal from "../components/PasswordModal";

export const Settings = () => {
    const { currentUser, isEmailUser, isGoogleUser } = useAuth();
    const uid = currentUser.uid;
    const currentUsername = currentUser.displayName;
    const currentEmail = currentUser.email;
    const [username, setUsername] = useState(currentUsername);
    const [email, setEmail] = useState(currentEmail);
    const [password, setPassword] = useState("");
    const [RUID, setRUID] = useState("");
    const [PAC, setPAC] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isDelAccModalOpen, setIsDelAccModalOpen] = useState(false);
    const [isDelCredModalOpen, setIsDelCredModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const fetchUserData = async () => {
        const { RUID, PAC } = await fetchUserCreds(uid);
        setRUID(RUID);
        setPAC(PAC);
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        fetchUserData();
    }, []);

    const deleteCredentials = async (event) => {
        const response = await deleteCreds(uid);

        if (response.status === 200) {
            toast.success("Successfully deleted your credentials!");
        }
        setIsDelCredModalOpen(false);
        setIsSaving(false);
    };

    const deleteUserAccount = async () => {
        try {
            const response = await deleteAccount();
            if (response.status !== 200) throw new Error(response.data);

            const serverRes = await deleteAccountFromDB(uid);
            if (serverRes.status !== 200) throw new Error(serverRes.data);

            toast.success("Successfully deleted your account!");
        } catch (error) {
            console.error(`Error deleting your account: ${error}`);
            toast.error("There was an error in the system. Try again later.");
            setIsDelAccModalOpen(false);
            setIsSaving(false);
        }
    };

    const handleCredentials = async (event) => {
        event.preventDefault();

        if (RUID === "" || PAC === "") {
            toast.warning("Make sure to enter in both your RUID and PAC.");
            return;
        }

        if (RUID.match(/^[/\d]{9}?$/) == null) {
            toast.error("Please enter a valid 9-digit RUID.");
            return;
        }

        if (PAC.match(/^[/\d]{4}?$/) == null) {
            toast.error("Please enter a valid 4-digit PAC.");
            return;
        }
        const response = await updateCreds(uid, RUID, PAC);

        if (response.status === 200) {
            toast.success("Successfully updated your credentials!");
        }
    };

    const handleAccountDetails = async (event) => {
        event.preventDefault();

        if (username === currentUsername && email === currentEmail && password === "") {
            toast.error("No changes have been made");
            return;
        }

        if (username === "" || email === "") {
            toast.warning("Your username or email cannot be empty");
            return;
        }

        if (isGoogleUser && email !== currentEmail) {
            toast.error(
                "You cannot change your email since you have already linked your Google account."
            );
            return;
        }

        const shouldLinkEmail = isGoogleUser && !isEmailUser && password !== "";

        if (
            shouldLinkEmail &&
            password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) == null
        ) {
            toast.warning(
                "Make sure your password has minimum eight characters, at least one letter and one number."
            );
            return;
        }

        const response = shouldLinkEmail
            ? await linkGoogleWithEmail(username, email, password)
            : await updateUserDetails(username, email, password);

        if (response.status === 200)
            toast.success("Successfully updated your account details!");
        else toast.error("There was an error in the system. Try again later");
    };

    return (
        <div className="w-screen min-h-screen bg-white">
            <Header pageNum={3} />
            {!loading && (
                <div className="flex justify-center px-12 py-20 gap-x-6">
                    <div className="w-1/3 pt-2 pb-4 overflow-scroll bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
                        <div className="flex flex-col items-center">
                            <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 ">
                                <div className="space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className="pb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                        Account Details
                                    </h1>

                                    <div className="space-y-4 md:space-y-6">
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
                                            placeholder="Enter new password (min. 8 characters)"
                                            hidden={true}
                                        />

                                        <div className="flex items-end w-2/5 ">
                                            <button
                                                className="bg-gray-50 border text-sm border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 hover:bg-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                type="button"
                                                disabled={isSaving}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsSaving(true);
                                                    setIsDelAccModalOpen(true);
                                                }}
                                            >
                                                Delete Account
                                            </button>
                                        </div>

                                        <div className="">
                                            <button
                                                className="bg-gray-50 border font-bold border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                type="button"
                                                onClick={handleAccountDetails}
                                                disabled={isSaving}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/3 pt-2 pb-4 overflow-scroll bg-gray-800 border border-gray-700 rounded-lg shadow-md">
                        <div className="flex flex-col items-center">
                            <div className="w-full rounded-lg md:mt-0 sm:max-w-md xl:p-0 ">
                                <div className="space-y-4 md:space-y-6 sm:p-8">
                                    <h1 className="pb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                        Credentials
                                    </h1>

                                    <div className="space-y-4 md:space-y-6">
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

                                        <div className="flex items-end w-2/5 ">
                                            <button
                                                className="bg-gray-50 border text-sm border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 hover:bg-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                type="button"
                                                disabled={isSaving}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsSaving(true);
                                                    setIsDelCredModalOpen(true);
                                                }}
                                            >
                                                Delete Credentials
                                            </button>
                                        </div>

                                        <div className="">
                                            <button
                                                className="bg-gray-50 border font-bold border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                type="button"
                                                onClick={handleCredentials}
                                                disabled={isSaving}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ConfirmModal
                        isOpen={isDelAccModalOpen}
                        onClose={() => {
                            setIsSaving(false);
                            setIsDelAccModalOpen(false);
                        }}
                        onConfirm={() => {
                            isEmailUser
                                ? setIsPasswordModalOpen(true)
                                : deleteUserAccount(); // may cause error if user hasn't recently logged in
                        }}
                        message="Are you sure you want to delete your account?"
                    />

                    <ConfirmModal
                        isOpen={isDelCredModalOpen}
                        onClose={() => {
                            setIsSaving(false);
                            setIsDelCredModalOpen(false);
                        }}
                        onConfirm={() => {
                            deleteCredentials();
                        }}
                        message="Are you sure you want to delete your credentials?"
                    />

                    <PasswordModal
                        isOpen={isPasswordModalOpen}
                        onClose={() => {
                            setIsPasswordModalOpen(false);
                        }}
                        ifSuccess={() => deleteUserAccount()}
                    />
                </div>
            )}
        </div>
    );
};
