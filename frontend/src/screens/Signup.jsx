import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../firebase/auth";
import { toast } from "sonner";
import HiddenInput from "../components/HiddenInput";
import { signInWithGoogle } from "../firebase/auth";

export const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !email || !password) return;

        if (password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) == null) {
            toast.warning(
                "Make sure your password has minimum eight characters, at least one letter and one number."
            );
            return;
        }

        if (!isSigningUp) {
            setIsSigningUp(true);
            const success = await signUp(username, email, password);
            if (success) {
                toast.success("Successfully signed up!");
                navigate("/");
            } else {
                toast.info("You already have an account. Please log in.");
            }
            setIsSigningUp(false);
        }
    };

    return (
        <div className="w-screen bg-white">
            <div className="flex items-center justify-center min-h-screen px-24 py-12">
                <div className="w-2/5 pt-2 pb-4 overflow-scroll bg-white border border-gray-200 rounded-lg shadow-md">
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="pb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Sign Up
                                </h1>

                                <button
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white font-semibold dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    type="button"
                                    onClick={async () => await signInWithGoogle()}
                                >
                                    Sign up with Google
                                </button>
                                <div className="flex items-center my-6">
                                    <div
                                        className="mr-3 border-t border-gray-400 border-solid grow"
                                        aria-hidden="true"
                                    ></div>
                                    <div className="text-gray-400">
                                        Or, sign up with your email
                                    </div>
                                    <div
                                        className="ml-3 border-t border-gray-400 border-solid grow"
                                        aria-hidden="true"
                                    ></div>
                                </div>
                                <form
                                    className="space-y-4 md:space-y-6"
                                    onSubmit={handleSubmit}
                                >
                                    <div>
                                        <label
                                            htmlFor="username"
                                            className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
                                        >
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="outline-none border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                                            placeholder="Enter a username"
                                            autoComplete="off"
                                            required=""
                                        ></input>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="outline-none border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                                            placeholder="example@gmail.com"
                                            required=""
                                        ></input>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 text-sm font-medium text-left text-gray-900 dark:text-white"
                                        >
                                            Password
                                        </label>
                                        <HiddenInput
                                            type="password"
                                            value={password}
                                            setValue={setPassword}
                                            placeholder="Enter a password (at least 8 characters)"
                                            isEditable={true}
                                        />
                                    </div>

                                    <div className="flex items-center my-6">
                                        <div
                                            className="mr-3 border-t border-gray-400 border-solid grow"
                                            aria-hidden="true"
                                        ></div>
                                    </div>

                                    <button
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="submit"
                                        disabled={isSigningUp}
                                    >
                                        {isSigningUp ? "Signing Up..." : "Sign Up"}
                                    </button>

                                    <p className="font-light text-gray-500 text-md dark:text-gray-400">
                                        Already have an account?{" "}
                                        <a
                                            href="/"
                                            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                        >
                                            Sign in
                                        </a>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
