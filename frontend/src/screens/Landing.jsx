import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../firebase/auth";
import { toast } from "sonner";
import HiddenInput from "../components/HiddenInput";

export const Landing = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email || !password) return;

        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await signIn(email, password);
                navigate("/dashboard");
            } catch (error) {
                console.log("Error:" + error);
                setIsSigningIn(false);
                toast.error("Invalid username/password. Try again.");
            }
        }
    };

    return (
        <div className="w-screen bg-white">
            <div className="flex items-center justify-center min-h-screen px-24 py-12 ">
                <div className="w-3/5 p-6 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 ">
                        RU Course Sniper
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et
                        quasi iusto modi velit ut non voluptas in. Explicabo id ut
                        laborum.
                    </p>
                </div>
                <div className="w-2/5 pt-2 pb-4 overflow-scroll bg-white border border-gray-200 rounded-lg shadow-md">
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="pb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Sign in to your account
                                </h1>

                                <button className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white font-semibold dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    Sign in with Google
                                </button>
                                <div className="flex items-center my-6">
                                    <div
                                        className="mr-3 border-t border-gray-400 border-solid grow"
                                        aria-hidden="true"
                                    ></div>
                                    <div className="text-gray-400">
                                        Or, sign in with your email
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
                                            placeholder="••••••••••••"
                                            isEditable={true}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start">
                                            <div className="flex items-center justify-start text-sm">
                                                <input
                                                    type="checkbox"
                                                    name="remember"
                                                    id="remember"
                                                    value={remember}
                                                    onChange={(e) =>
                                                        setRemember(e.target.checked)
                                                    }
                                                    className="hover:cursor-pointer peer h-4 w-4 shrink-0 border border-gray-600/50 text-white-main focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary-600/50 data-[state=checked]:bg-primary-800 rounded"
                                                    required=""
                                                ></input>
                                                <label
                                                    htmlFor="remember"
                                                    className="pl-2 text-gray-500 hover:cursor-pointer dark:text-gray-300"
                                                >
                                                    Remember me
                                                </label>
                                            </div>
                                        </div>
                                        <a
                                            href="#"
                                            className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>

                                    <button
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="submit"
                                        disabled={isSigningIn}
                                    >
                                        {isSigningIn ? "Signing In..." : "Sign In"}
                                    </button>

                                    <p className="font-light text-gray-500 text-md dark:text-gray-400">
                                        Don’t have an account yet?{" "}
                                        <a
                                            href="/signup"
                                            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                                        >
                                            Sign up
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
