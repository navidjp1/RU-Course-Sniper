import { useState, useRef, useEffect } from "react";
import PasswordModal from "./PasswordModal";
import { useAuth } from "../contexts/authContext/authContext";
import { reauthenticateUser } from "../firebase/auth";
import { toast } from "sonner";
import HiddenInput from "./HiddenInput";

function SettingsInput({ label, type, value, setValue, placeholder, hidden }) {
    const { currentUser } = useAuth();
    const [isEditable, setIsEditable] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    const toggleEdit = () => {
        if (type === "password") {
            if (isEditable) {
                setIsEditable(false);
                return;
            }
            setIsModalOpen(true);
            return;
        }
        setIsEditable((prev) => !prev);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsEditable(false);
        }
    };

    const handleConfirmPassword = async (currentPassword) => {
        const success = await reauthenticateUser(currentPassword);

        if (success.message === "success") {
            setIsEditable(true);
            setIsModalOpen(false);
        } else if (success.message === "incorrect") {
            toast.error("The password is incorrect, try again");
        } else {
            toast.warning("Error in the system, try again later");
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={containerRef}>
            <label
                htmlFor={type}
                className="flex justify-start mb-2 text-sm font-medium text-left text-white"
            >
                {label}
            </label>
            <div className="flex flex-row justify-between">
                {hidden ? (
                    <HiddenInput
                        type={type}
                        value={value}
                        setValue={setValue}
                        placeholder={placeholder}
                        isEditable={isEditable}
                        inputRef={inputRef}
                    ></HiddenInput>
                ) : (
                    <input
                        type={type}
                        name={type}
                        id={type}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                        className={`justify-start rounded-lg w-full p-2.5 ${
                            isEditable
                                ? "bg-gray-700 border-gray-600"
                                : "bg-transparent border-transparent "
                        } outline-none  placeholder-gray-400 text-white `}
                        required=""
                        readOnly={!isEditable}
                        ref={inputRef}
                    ></input>
                )}

                <button
                    className="justify-end pl-2 hover:cursor-pointer"
                    onClick={toggleEdit}
                    type="button"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`size-5  ${
                            isEditable ? "text-blue-500" : "text-white"
                        }`}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                    </svg>
                </button>
            </div>
            <div>
                <PasswordModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleConfirmPassword}
                />
            </div>
        </div>
    );
}

export default SettingsInput;
