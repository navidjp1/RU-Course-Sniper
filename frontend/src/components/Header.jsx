import { doSignOut } from "../firebase/auth";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";

function Header({ pageNum }) {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handleLogout = async () => {
        await doSignOut();
    };

    return (
        <div>
            <header className="sticky top-0 w-full px-16 py-4 opacity-100 bg-rich-black">
                <div className="flex items-center justify-between text-xl">
                    <div className="flex items-center justify-start">
                        <p className="text-xl text-platinum">RU</p>
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
                    <div className="flex items-center justify-end">
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
