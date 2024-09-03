import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, sendPasswordReset, signInWithGoogle } from "../firebase/auth";
import { toast } from "sonner";
import HiddenInput from "../components/HiddenInput";
import googleIcon from "../assets/google.svg";

export const Landing = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [disabled, setDisabled] = useState(false);
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

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        setDisabled(true);
        if (!email) {
            toast.error(
                "Enter your email in the email field to send a password reset email."
            );
            setDisabled(false);
            return;
        }
        try {
            const { status, message } = await sendPasswordReset(email);
            if (status !== 200) throw new Error(message);
            toast.success("Password reset email sent.");
        } catch (error) {
            console.log(error.message);
            toast.error("There was an error in the system. Try again later.");
        }
        setDisabled(false);
    };

    return (
        <div className="w-screen bg-rich-black">
            <div className="flex flex-col items-center justify-center min-h-screen gap-12 px-6 py-12 lg:flex-row lg:px-24">
                <div className="max-w-lg p-6 text-center lg:w-3/5 lg:text-left text-platinum ">
                    <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
                        RU AutoSnipe
                    </h2>
                    <p className="mt-6 text-base leading-8 lg:text-lg">
                        Automatically snipe the courses you want! There's no need to worry
                        about having to snipe the course yourself, our bot will take care
                        of that for you. Sign up to get started!
                    </p>
                </div>
                <div className="max-w-lg pt-2 pb-4 border border-gray-200 rounded-lg shadow-md sm:w-auto lg:w-2/5 bg-platinum">
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-full rounded-lg shadow dark:border bg-rich-black text-platinum">
                            <div className="space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl font-bold leading-tight tracking-tight text-center md:text-2xl">
                                    Sign in to your account
                                </h1>
                                <button
                                    className=" bg-platinum text-rich-black border hover:text-blue-munsell font-semibold border-gray-300 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    type="button"
                                    onClick={async () => await signInWithGoogle()}
                                >
                                    <div className="flex flex-row items-center justify-center gap-x-3">
                                        <img
                                            src={googleIcon}
                                            alt="Google Icon"
                                            className="w-5 h-5"
                                        />
                                        <span>Sign in with Google</span>
                                    </div>
                                </button>
                                <div className="flex items-center my-6">
                                    <div className="mr-3 border-t border-solid border-platinum grow"></div>
                                    <div>Or, sign in with your email</div>
                                    <div className="ml-3 border-t border-solid border-platinum grow"></div>
                                </div>
                                <form
                                    className="space-y-4 md:space-y-6"
                                    onSubmit={handleSubmit}
                                >
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-sm font-medium text-left"
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
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 text-sm font-medium text-left"
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
                                    <div className="flex items-center justify-end">
                                        <button
                                            className="text-sm font-medium hover:underline"
                                            onClick={(e) => handleForgotPassword(e)}
                                            type="button"
                                            disabled={disabled}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>

                                    <button
                                        className="bg-midnight-green hover:text-blue-munsell font-semibold rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        type="submit"
                                        disabled={isSigningIn}
                                    >
                                        {isSigningIn ? "Signing In..." : "Sign In"}
                                    </button>

                                    <p className="text-sm font-light lg:text-md">
                                        Don’t have an account yet?{" "}
                                        <a
                                            href="/signup"
                                            className="font-medium text-primary-600 hover:underline"
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
