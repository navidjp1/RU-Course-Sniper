import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext/authContext";
import axios from "axios";
import Header from "../components/Header";
export const Purchase = () => {
    const { currentUser } = useAuth();
    const [isBuying, setIsBuying] = useState(false);

    // useEffect(() => {

    // }, []);

    const userPurchase = async (event, numTokens) => {
        event.preventDefault();

        console.log(numTokens);
    };

    return (
        <div className="bg-white w-screen min-h-screen">
            <Header pageNum={2} />
            <div className="flex justify-center  py-20 px-12 gap-x-4">
                <div className="pt-2 pb-4 w-2/5 overflow-scroll rounded-lg border border-gray-200 shadow-md bg-white">
                    <div className="flex flex-col items-center p-4 ">
                        <div className="w-full  bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl pb-4 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    1 Token
                                </h1>
                                <h1 className="text-xl pb-4 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    $5
                                </h1>
                                <button
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 font-bold dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    disabled={isBuying}
                                    onClick={(e) => {
                                        userPurchase(e, 1);
                                    }}
                                >
                                    {isBuying ? "Purchasing..." : "Purchase"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-2 pb-4 w-2/5 overflow-scroll rounded-lg border border-gray-200 shadow-md bg-white">
                    <div className="flex flex-col items-center p-4">
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl pb-4 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    3 Tokens
                                </h1>
                                <h1 className="text-xl pb-4 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    $12
                                </h1>
                                <button
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 font-bold dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    disabled={isBuying}
                                    onClick={(e) => {
                                        userPurchase(e, 3);
                                    }}
                                >
                                    {isBuying ? "Purchasing..." : "Purchase"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-2 pb-4 w-2/5 overflow-scroll rounded-lg border border-gray-200 shadow-md bg-white">
                    <div className="flex flex-col items-center p-4">
                        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                            <div className="space-y-4 md:space-y-6 sm:p-8">
                                <h1 className="text-xl pb-4 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    5 Tokens
                                </h1>
                                <h1 className="text-xl pb-4 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    $15
                                </h1>
                                <button
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 hover:text-blue-500 dark:bg-gray-700 font-bold dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    disabled={isBuying}
                                    onClick={async (e) => {
                                        userPurchase(e, 5);
                                    }}
                                >
                                    {isBuying ? "Purchasing..." : "Purchase"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
