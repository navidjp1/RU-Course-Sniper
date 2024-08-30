import { useEffect, useRef } from "react";
function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
    const handleBackdropClick = () => {
        onClose();
    };

    const handleModalContentClick = (event) => {
        event.stopPropagation();
    };

    useEffect(() => {
        const handleKeyDown = async (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <main className="confirm-modal">
            {isOpen && (
                <div
                    className={`fixed inset-0 flex z-50 justify-center pt-8 bg-black bg-opacity-50`}
                    onClick={handleBackdropClick}
                >
                    <div
                        className={`flex items-center justify-center flex-col bg-white p-6 h-fit w-1/3 rounded shadow-md fade-in`}
                        onClick={handleModalContentClick}
                    >
                        <h2 className="mb-6 text-lg font-semibold">{message}</h2>
                        <div className="w-full">
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

export default ConfirmModal;
