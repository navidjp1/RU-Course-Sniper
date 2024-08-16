import { useState, useEffect } from "react";
import HiddenInput from "./HiddenInput";
function PasswordModal({ isOpen, onClose, onConfirm }) {
    const [currentPassword, setCurrentPassword] = useState("");

    if (!isOpen) return null;

    const handleBackdropClick = () => {
        onClose();
    };

    const handleModalContentClick = (event) => {
        event.stopPropagation();
    };

    return (
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
                        value={currentPassword}
                        setValue={setCurrentPassword}
                        placeholder="Current Password"
                        extraStyles="mb-6"
                        isEditable={true}
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
                            onClick={handleSubmit}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PasswordModal;
