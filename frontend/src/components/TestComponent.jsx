import React from "react";
import Header from "./Header";

function TestComponent() {
    return (
        <div className="bg-white w-screen">
            <Header />
            <div className="flex min-h-screen items-center py-12 px-24 justify-center">
                <div className="mx-auto max-w-2xl p-6 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 ">
                        Simple no-tricks pricing
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et
                        quasi iusto modi velit ut non voluptas in. Explicabo id ut
                        laborum.
                    </p>
                </div>
                <div className="pt-2 pb-4 overflow-scroll px-4 rounded-lg border border-gray-200 shadow-md bg-white">
                    <table className="w-full min-w-max table-auto text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr>
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-8 py-4 w-64">
                                    <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                                        Course
                                    </p>
                                </th>
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-8 py-4">
                                    <p className="block antialiased text-center font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                                        Index
                                    </p>
                                </th>
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-8 py-4">
                                    <p className="block antialiased text-center font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                                        Section
                                    </p>
                                </th>
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-8 py-4">
                                    <p className="block antialiased text-center font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                                        Status
                                    </p>
                                </th>
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-8 py-4">
                                    <p className="block antialiased text-center font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                                        Action
                                    </p>
                                </th>
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-8 py-4">
                                    <p className="block antialiased text-center font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                                        Details
                                    </p>
                                </th>
                                <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 px-8 py-4">
                                    <p className="block antialiased text-center font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">
                                        Delete
                                    </p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200">
                                <td className="p-8">
                                    <div className="flex items-center gap-3">
                                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                                            Spotify
                                        </p>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                                        [XXXXX]
                                    </p>
                                </td>
                                <td className="p-8">
                                    <p className="block antialiased text-center font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                                        01
                                    </p>
                                </td>
                                <td className="p-8">
                                    <div className="w-22">
                                        <div
                                            className="text-center relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-green-500/20 text-green-900 py-1 px-2 text-xs rounded-md"
                                            style={{ opacity: "1" }}
                                        >
                                            <span className="">Sniping</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-12 rounded-md border border-blue-gray-50 p-1"></div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal capitalize">
                                                visa
                                            </p>
                                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal opacity-70">
                                                06/2026
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <button
                                        className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20"
                                        type="button"
                                    >
                                        <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                            >
                                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                                            </svg>
                                        </span>
                                    </button>
                                </td>
                            </tr>

                            <tr className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 ">
                                <td className="p-8">
                                    <div className="flex items-center gap-3">
                                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                                            Pinterest
                                        </p>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                                        [XXXXX]
                                    </p>
                                </td>
                                <td className="p-8">
                                    <p className="block antialiased text-center font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                                        01
                                    </p>
                                </td>
                                <td className="p-8">
                                    <div className="w-22">
                                        <div
                                            className="relative grid text-center items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-amber-500/20 text-amber-900 py-1 px-2 text-xs rounded-md"
                                            style={{ opacity: "1" }}
                                        >
                                            <span className="">Waitlisted</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-12 rounded-md border border-blue-gray-50 p-1"></div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal capitalize">
                                                visa
                                            </p>
                                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal opacity-70">
                                                06/2026
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <button
                                        className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20"
                                        type="button"
                                    >
                                        <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                            >
                                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                                            </svg>
                                        </span>
                                    </button>
                                </td>
                            </tr>

                            <tr className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 ">
                                <td className="p-8">
                                    <div className="flex items-center gap-3">
                                        <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">
                                            Netflix
                                        </p>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                                        [XXXXX]
                                    </p>
                                </td>
                                <td className="p-8">
                                    <p className="block antialiased text-center font-sans text-sm leading-normal text-blue-gray-900 font-normal">
                                        01
                                    </p>
                                </td>
                                <td className="p-8">
                                    <div className="w-22">
                                        <div
                                            className="relative grid text-center items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-red-500/20 text-red-900 py-1 px-2 text-xs rounded-md"
                                            style={{ opacity: "1" }}
                                        >
                                            <span className="">Inactive</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-12 rounded-md border border-blue-gray-50 p-1"></div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal capitalize">
                                                visa
                                            </p>
                                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal opacity-70">
                                                06/2026
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <button
                                        className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20"
                                        type="button"
                                    >
                                        <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                aria-hidden="true"
                                                className="h-4 w-4"
                                            >
                                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                                            </svg>
                                        </span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TestComponent;
