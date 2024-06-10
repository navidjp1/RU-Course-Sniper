import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // async function handleSubmit (e) {}
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:5173/signup", {
        email,
        password,
      });
    } catch (error) {
      console.log(error);
    }

    // console.log("Email:", email);
    // console.log("Password:", password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          action="POST"
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
              placeholder="Email"
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <p className="text-red-500 text-xs italic mb-4"></p>
          <div className="flex items-center justify-between text-center">
            <button
              type="submit"
              onSubmit={handleSubmit}
              className={`text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline && 'opacity-50 cursor-not-allowed'}`}
            >
              'Login'
            </button>
          </div>
        </form>
        <br />
        <p>OR</p>
        <br />

        <Link to="/">Login Page</Link>
      </div>
    </div>
  );
};
