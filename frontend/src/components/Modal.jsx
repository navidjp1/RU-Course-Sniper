function PasswordModal({ isOpen, children }) {
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
                {children}
            </div>
        </div>
    );
}

export default PasswordModal;
