import { useState, useRef, useEffect } from "react";
import HiddenInput from "./HiddenInput";
import PasswordModal from "./PasswordModal";
import { Tooltip } from "@mantine/core";
import { useAuth } from "../contexts/authContext";
import { toast } from "sonner";

function SettingsInput({ label, type, value, setValue, placeholder, hidden }) {
    const { isEmailUser } = useAuth();
    const [isEditable, setIsEditable] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const inputRef = useRef(null);
    const containerRef = useRef(null);

    const toggleEdit = () => {
        if (type === "password" && isEmailUser) {
            if (isEditable) {
                setIsEditable(false);
                return;
            }
            setIsPasswordModalOpen(true);
            return;
        }
        setIsEditable((prev) => !prev);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleClicks = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setIsEditable(false);
        }

        if (type !== "password" && inputRef.current.contains(event.target)) {
            setIsEditable(true);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClicks);

        return () => {
            document.removeEventListener("mousedown", handleClicks);
        };
    }, []);

    return (
        <div ref={containerRef}>
            <label
                htmlFor={type}
                className="flex justify-start mb-2 text-sm font-medium text-left text-rich-black gap-x-2"
            >
                {label}
                {type == "pac" && (
                    <Tooltip
                        className="bg-rich-black text-platinum "
                        multiline
                        w={200}
                        position="right"
                        transitionProps={{ transition: "pop", duration: 200 }}
                        label="Your PAC is usually your birthday in MMDD format (eg. 0312 for March 12th), unless you've manually changed it."
                    >
                        <div className="relative flex items-center ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="relative cursor-pointer text-rich-black size-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                                />
                            </svg>
                        </div>
                    </Tooltip>
                )}
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
                        onConfirm={toggleEdit}
                    ></HiddenInput>
                ) : (
                    <input
                        type={type}
                        name={type}
                        id={type}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={placeholder}
                        className={`justify-start border  rounded-lg w-full p-2.5 ${
                            isEditable
                                ? "bg-rich-black text-platinum "
                                : "bg-transparent border-gray-700 text-rich-black"
                        } outline-none  placeholder-gray-800  `}
                        required=""
                        readOnly={!isEditable}
                        ref={inputRef}
                        autoComplete="off"
                        spellCheck="false"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") toggleEdit();
                        }}
                    ></input>
                )}

                <button
                    className="justify-end pl-2 border-transparent outline-none hover:cursor-pointer"
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
                            isEditable ? "text-slate-gray" : "text-rich-black"
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
                    isOpen={isPasswordModalOpen}
                    onClose={() => {
                        setIsPasswordModalOpen(false);
                    }}
                    ifSuccess={() => {
                        setIsEditable(true);
                        setIsPasswordModalOpen(false);
                        toast.success("You can edit your password now");
                    }}
                />
            </div>
        </div>
    );
}

export default SettingsInput;
