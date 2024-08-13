import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../firebase/auth";

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
            alert(
                "Make sure your password has minimum eight characters, at least one letter and one number."
            );
            return;
        }

        try {
            const result = await axios.post("http://localhost:3000/api/check_username", {
                username,
            });
            if (result.data === "Duplicate username") {
                alert("Username already taken. Try a different one.");
                return;
            }
        } catch (error) {
            console.log("Error sending API request: " + error);
            return;
        }

        const userData = { username, email, password };

        if (!isSigningUp) {
            setIsSigningUp(true);
            const success = await signUp(username, email, password);
            if (success) {
                await axios
                    .post("http://localhost:3000/api/register_user_data", userData)
                    .then((result) => {
                        if (result.data === "Success") {
                            alert("Successfully signed up!");
                            navigate("/");
                        } else {
                            alert("There was an error in the system. Try again.");
                            console.log(result.data);
                        }
                    })
                    .catch((err) => console.log("Error sending API request: " + err));
            } else {
                alert("You already have an account. Please log in.");
            }
            setIsSigningUp(false);
        }
    };

    return (
        <div className="bg-white w-screen">
            <div className="flex min-h-screen items-center py-12 px-24 justify-center">
                <div className="pt-2 pb-4 w-2/5 overflow-scroll rounded-lg border border-gray-200 shadow-md bg-white">
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl pb-4 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    Sign Up
                                </h1>

                                <button className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white font-semibold dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    Sign up with Google
                                </button>
                                <div className="my-6 flex items-center">
                                    <div
                                        className="mr-3 grow border-t border-solid border-gray-400"
                                        aria-hidden="true"
                                    ></div>
                                    <div className="text-gray-400">
                                        Or, sign up with your email
                                    </div>
                                    <div
                                        className="ml-3 grow border-t border-solid border-gray-400"
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
                                            className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Enter a username"
                                            required=""
                                        ></input>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block mb-2 text-left text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="example@gmail.com"
                                            required=""
                                        ></input>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter a password (at least 8 characters)"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            required=""
                                        ></input>
                                    </div>

                                    <div className="my-6 flex items-center">
                                        <div
                                            className="mr-3 grow border-t border-solid border-gray-400"
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

                                    <p className="text-md font-light text-gray-500 dark:text-gray-400">
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
