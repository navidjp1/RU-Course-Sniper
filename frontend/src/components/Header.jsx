import { doSignOut } from "../firebase/auth";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";

function Header({ pageNum }) {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleLogout = async () => {
        await doSignOut();
        navigate("/");
    };

    return (
        <div>
            <header className="fixed top-0 w-full px-16 py-4 bg-white opacity-75">
                <div className="flex justify-between text-xl">
                    <div className="flex items-center justify-start">
                        <p className="text-xl">RU</p>
                    </div>
                    <nav className="items-center justify-center" aria-label="Global">
                        <div className="hidden lg:flex lg:gap-x-12">
                            <a
                                href={pageNum !== 2 ? "/purchase" : "#"}
                                className={`font-sans leading-6 font-semibold  ${
                                    pageNum === 2 ? "" : "text-gray-900 "
                                } cursor-default `}
                            >
                                Purchase
                            </a>
                            <span className="text-gray-300">|</span> {/* Separator */}
                            <a
                                href={pageNum !== 1 ? "/dashboard" : "#"}
                                className={`font-sans leading-6 font-semibold  ${
                                    pageNum === 1 ? "" : "text-gray-900 "
                                } cursor-default `}
                            >
                                Dashboard
                            </a>
                            <span className="text-gray-300">|</span> {/* Separator */}
                            <a
                                href={pageNum !== 3 ? "/settings" : "#"}
                                className={`font-sans leading-6 font-semibold  ${
                                    pageNum === 3 ? "" : "text-gray-900 "
                                } cursor-default `}
                            >
                                Settings
                            </a>
                        </div>
                    </nav>
                    <div className="justify-end">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setIsConfirmModalOpen(true);
                            }}
                            className="font-semibold leading-6 text-gray-900 hover:text-red-500"
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
