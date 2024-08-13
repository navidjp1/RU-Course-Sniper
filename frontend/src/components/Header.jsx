import { doSignOut } from "../firebase/auth";

function Header({ pageNum }) {
    const handleLogout = async (event) => {
        event.preventDefault();
        const userConfirm = confirm("Are you sure you want to logout?");
        if (userConfirm) {
            await doSignOut();
            navigate("/");
        }
    };

    return (
        <header className="bg-white opacity-75 fixed top-0 w-full py-4 px-16">
            <div className="flex text-xl justify-between">
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
                        onClick={handleLogout}
                        className=" hover:text-red-500 font-semibold leading-6 text-gray-900"
                    >
                        Log out <span aria-hidden="true">&rarr;</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
