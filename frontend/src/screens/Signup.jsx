import { useState } from "react";
import { signUp } from "../firebase/auth";
import { toast } from "sonner";
import HiddenInput from "../components/HiddenInput";
import { signInWithGoogle } from "../firebase/auth";
import googleIcon from "../assets/google.svg";

export const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!username || !email || !password) return;

        if (
            !password.match(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
            )
        ) {
            toast.warning(
                "Password must be at least 8 characters long and contain at least one letter, one number, and one special character."
            );
            return;
        }

        if (!isSigningUp) {
            setIsSigningUp(true);
            const response = await signUp(username, email, password);
            // await new Promise((resolve) => setTimeout(resolve, 4000));
            if (response.status === 200) {
                toast.success(response.message);
                // navigate("/");
            } else if (response.status === 500) {
                toast.error("There was an error in the system. Try again later.");
            } else {
                toast.info("You already have an account. Please log in.");
            }
            setIsSigningUp(false);
        }
    };

    return (
        <div className="w-screen bg-rich-black text-platinum">
            <div className="flex items-center justify-center min-h-screen px-24 py-12">
                <div className="w-2/5 pt-2 pb-4 rounded-lg shadow-md bg-platinum">
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-rich-black text-platinum">
                            <div className="space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="pb-4 text-2xl font-bold leading-tight tracking-tight">
                                    Sign Up
                                </h1>

                                <button
                                    className="bg-platinum text-rich-black border hover:text-blue-munsell font-semibold border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                    type="button"
                                    onClick={async () => await signInWithGoogle()}
                                >
                                    <div className="flex flex-row items-center justify-center gap-x-3">
                                        <img
                                            src={googleIcon}
                                            alt="Google Icon"
                                            className="size-4"
                                        />
                                        <span className="">Sign up with Google</span>{" "}
                                    </div>
                                </button>
                                <div className="flex items-center my-6">
                                    <div
                                        className="mr-3 border-t border-solid border-platinum grow"
                                        aria-hidden="true"
                                    ></div>
                                    <div className="">Or, sign up with your email</div>
                                    <div
                                        className="ml-3 border-t border-solid border-platinum grow"
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
                                            className="block mb-2 text-sm font-medium text-left "
                                        >
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="outline-none border border-opacity-25 border-platinum rounded-lg block w-full p-2.5 bg-rich-black placeholder:text-blue-munsell hover:cursor-pointer hover:border-blue-munsell"
                                            placeholder="Enter a username"
                                            autoComplete="off"
                                            required=""
                                        ></input>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium text-left "
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="outline-none border border-opacity-25 border-platinum rounded-lg block w-full p-2.5 bg-rich-black placeholder:text-blue-munsell hover:cursor-pointer hover:border-blue-munsell"
                                            placeholder="example@gmail.com"
                                            required=""
                                        ></input>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 text-sm font-medium text-left "
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
                                            className="mr-3 border-t border-solid border-platinum grow"
                                            aria-hidden="true"
                                        ></div>
                                    </div>

                                    <button
                                        className="bg-midnight-green hover:text-blue-munsell font-semibold  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                                        type="submit"
                                        disabled={isSigningUp}
                                    >
                                        {isSigningUp ? "Signing Up..." : "Sign Up"}
                                    </button>

                                    <p className="font-light text-md">
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
