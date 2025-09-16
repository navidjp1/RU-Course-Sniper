import { doSignOut } from "../firebase/auth";
import ConfirmModal from "./ConfirmModal";
import { useState, useEffect } from "react";

function Header({ pageNum }) {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        // Check for user's preferred theme on initial load
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const handleLogout = async () => {
        await doSignOut();
    };

    return (
        <div>
            <header className="sticky top-0 w-full px-16 py-4 opacity-100 bg-rich-black">
                <div className="flex items-center justify-between text-xl">
                    <div className="flex items-center justify-start">
                        <img
                            src="/logo.svg"
                            alt="Course Sniper Logo"
                            className="w-auto h-8"
                        />
                    </div>
                    <nav
                        className="flex items-center justify-center flex-1"
                        aria-label="Global"
                    >
                        <div className="flex">
                            <a
                                href={pageNum !== 1 ? "/dashboard" : "#"}
                                className={`pl-10  font-semibold border-r-2 border-gray-600 pr-8 ${
                                    pageNum === 1 ? "" : "text-platinum"
                                } cursor-default`}
                            >
                                Dashboard
                            </a>
                            <a
                                href={pageNum !== 3 ? "/settings" : "#"}
                                className={` font-semibold pl-8 ${
                                    pageNum === 3 ? "" : "text-platinum"
                                } cursor-default`}
                            >
                                Settings
                            </a>
                        </div>
                    </nav>
                    <div className="flex items-center justify-end space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-white transition-colors rounded-full hover:bg-red-700 dark:hover:bg-red-900"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? (
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                                </svg>
                            ) : (
                                <svg
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setIsConfirmModalOpen(true);
                            }}
                            className="font-semibold leading-6 text-platinum hover:text-red-500"
                        >
                            Log out <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                </div>
            </header>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => {
                    setIsConfirmModalOpen(false);
                }}
                onConfirm={async () => {
                    handleLogout();
                }}
                message="Are you sure you want to logout?"
            />
        </div>
    );
}

export default Header;

{
    /* <a
        href={pageNum !== 2 ? "/purchase" : "#"}
        className={` leading-6 font-semibold  ${
            pageNum === 2 ? "" : "text-gray-900 "
        } cursor-default `}
    >
        Purchase
    </a> */
}
