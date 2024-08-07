import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { signIn } from "../firebase/auth";
import { useAuth } from "../contexts/authContext/authContext";

export const Landing = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await signIn(email, password);
                navigate("/dashboard");
            } catch (error) {
                console.log("Error:" + error);
                setIsSigningIn(false);
                alert("Invalid username/password. Try again.");
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="w-1/2 p-8 bg-blue-500 text-white">
                        <h2 className="text-3xl font-bold mb-4">Home</h2>
                        <p className="text-lg mb-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. In hendrerit accumsan neque. Nullam egestas
                            magna in nisl gravida dignissim.
                        </p>
                        <p className="text-lg">
                            Sed sollicitudin ac enim et iaculis. Curabitur
                            turpis metus, finibus vitae lectus eu, aliquam
                            semper nisi. Nulla facilisi.
                        </p>
                    </div>
                    <div className="w-1/2 p-8">
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            Login
                        </h2>
                        <form
                            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                            onSubmit={handleSubmit}
                        >
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter email"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label
                                    htmlFor="password"
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                >
                                    Password:
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter password"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    required
                                />
                            </div>
                            <p className="text-red-500 text-xs italic mb-4"></p>
                            <div className=" items-center justify-between text-center">
                                <button
                                    type="submit"
                                    disabled={isSigningIn}
                                    className={`text-center w-48 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline && 'opacity-50 cursor-not-allowed'}`}
                                >
                                    {isSigningIn ? "Signing In..." : "Sign In"}
                                </button>
                                <Link to="/dashboard">
                                    <button className=" pl-4 w-48 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded">
                                        Dashboard
                                    </button>
                                </Link>
                            </div>
                        </form>
                        <br />
                        <p>OR</p>
                        <br />

                        <Link to="/signup">Signup Page</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
