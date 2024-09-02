import React from "react";

export const PageNotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-rich-black text-platinum">
            <div className="text-center">
                <h1 className="text-6xl font-bold ">404</h1>
                <p className="mt-4 text-xl ">Page Not Found</p>
                <p className="mt-2 ">
                    Sorry, the page you are looking for does not exist.
                </p>
                <a
                    href="/"
                    className="inline-block px-4 py-2 mt-6 rounded text-platinum bg-blue-munsell hover:bg-platinum hover:text-rich-black"
                >
                    Go Back Home
                </a>
            </div>
        </div>
    );
};
