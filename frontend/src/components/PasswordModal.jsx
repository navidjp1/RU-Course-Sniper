import HiddenInput from "./HiddenInput";
import { useEffect } from "react";

function PasswordModal({ isOpen, onClose, onConfirm, value, setValue }) {
    const handleBackdropClick = () => {
        onClose();
    };

    const handleModalContentClick = (event) => {
        event.stopPropagation();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onConfirm(e);
        } else if (e.key === "Escape") {
            onClose();
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

    return (
        <main className="password-modal">
            {isOpen && (
                <div
                    className="fixed inset-0 flex justify-center pt-8 bg-black bg-opacity-50"
                    onClick={handleBackdropClick}
                >
                    <div
                        className={`flex items-center justify-center flex-col bg-white p-6 h-fit w-1/3 rounded shadow-md fade-in`}
                        onClick={handleModalContentClick}
                    >
                        <h2 className="mb-6 text-lg font-semibold">
                            Enter Your Current Password
                        </h2>
                        <div className="w-full">
                            <HiddenInput
                                type="password"
                                value={value}
                                setValue={setValue}
                                placeholder="Current Password"
                                extraStyles="mb-6"
                                isEditable={true}
                                onConfirm={onConfirm}
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
                                    className="justify-end px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-800"
                                    onClick={onConfirm}
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
