import HiddenInput from "./HiddenInput";
import { useEffect, useState } from "react";
import { reauthenticateUser } from "../firebase/auth";
import { toast } from "sonner";

function PasswordModal({ isOpen, onClose, ifSuccess }) {
    const [userEnteredPassword, setUserEnteredPassword] = useState("");

    const handleBackdropClick = () => {
        onClose();
    };

    const handleModalContentClick = (event) => {
        event.stopPropagation();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleConfirmPassword(e);
        } else if (e.key === "Escape") {
            onClose();
            setUserEnteredPassword("");
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleConfirmPassword = async (e) => {
        e.preventDefault();
        if (!userEnteredPassword) return;

        const success = await reauthenticateUser(userEnteredPassword);

        if (success.message === "success") {
            ifSuccess();
        } else if (success.message === "incorrect") {
            toast.error("The password is incorrect, try again");
        } else {
            toast.warning("Error in the system, try again later");
        }
        setUserEnteredPassword("");
    };

    return (
        <main className="password-modal">
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex justify-center pt-8 bg-black bg-opacity-50"
                    onClick={handleBackdropClick}
                >
                    <div
                        className={`flex items-center justify-center flex-col bg-platinum p-6 h-fit w-1/3 rounded shadow-md fade-in`}
                        onClick={handleModalContentClick}
                    >
                        <h2 className="mb-6 text-lg font-semibold">
                            Enter Your Current Password
                        </h2>
                        <div className="w-full">
                            <HiddenInput
                                type="password"
                                value={userEnteredPassword}
                                setValue={setUserEnteredPassword}
                                placeholder="Current Password"
                                extraStyles="mb-6"
                                isEditable={true}
                                onConfirm={(e) => handleConfirmPassword(e)}
                            ></HiddenInput>

                            <div className="flex justify-between w-full">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="justify-start px-4 py-2 text-white bg-gray-500 rounded hover:bg-red-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="justify-end px-4 py-2 rounded bg-rich-black text-platinum hover:bg-midnight-green"
                                    onClick={(e) => handleConfirmPassword(e)}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default PasswordModal;
