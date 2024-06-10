import React, { useState } from "react";

export const Landing = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="w-1/2 p-8 bg-blue-500 text-white">
          <h2 className="text-3xl font-bold mb-4">Welcome to Our Project</h2>
          <p className="text-lg mb-6">
            Our project aims to provide an innovative solution to help you
            manage your tasks efficiently and effectively. Join us to experience
            a new way of task management.
          </p>
          <p className="text-lg">
            Whether you are an individual or a team, our tool is designed to fit
            your needs and help you achieve your goals.
          </p>
        </div>
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <p className="text-red-500 text-xs italic mb-4"></p>
            <div className="flex items-center justify-between text-center">
              <button
                type="submit"
                className={`text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline && 'opacity-50 cursor-not-allowed'}`}
              >
                'Logging in...' : 'Login'
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
