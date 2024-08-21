import axios from "axios";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { fetchTokenBalance } from "../api/fetchData";
import { toast } from "sonner";
export const Purchase = () => {
    const { currentUser } = useAuth();
    const uid = currentUser.uid;
    const [isBuying, setIsBuying] = useState(false);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { userTokenBalance } = await fetchTokenBalance(uid);
            if (userTokenBalance === "") return;
            setTokenBalance(userTokenBalance);
            setLoading(false);
        };

        fetchData();
    }, []);

    const userPurchase = async (event, numTokens) => {
        event.preventDefault();
        setIsBuying(true);

        try {
            const response = await axios.post(
                "http://localhost:3000/api/purchase_tokens",
                { uid, numTokens }
            );
            const msg = response.data.message;
            if (response.status !== 200) throw new Error(msg);
            setTokenBalance(tokenBalance + numTokens);
            toast.success("Successfully purchased " + numTokens + " tokens!");
        } catch (error) {
            console.error(`Error updating token balance: ${error}`);
            toast.error("There was an error in the system. Try again later.");
        }
        setIsBuying(false);
    };

    return (
        <main className="purchase">
            {!loading && (
                <div className="w-screen min-h-screen bg-white">
                    <Header pageNum={2} />
                    <div className="mt-10">
                        <h1 className="text-3xl font-bold">Purchase Tokens</h1>
                        <h3 className="mt-6 text-2xl font-bold">
                            Current Balance: {tokenBalance}
                        </h3>
                    </div>
                    <div className="flex justify-center px-12 py-20 gap-x-4">
                        <div className="w-2/5 pt-2 pb-4 overflow-scroll bg-white border border-gray-200 rounded-lg shadow-md">
                            <div className="flex flex-col items-center p-4 ">
                                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="space-y-4 md:space-y-6 sm:p-8">
                                        <h1 className="pb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                            1 Token
                                        </h1>
                                        <h1 className="pb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
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
                        <div className="w-2/5 pt-2 pb-4 overflow-scroll bg-white border border-gray-200 rounded-lg shadow-md">
                            <div className="flex flex-col items-center p-4">
                                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="space-y-4 md:space-y-6 sm:p-8">
                                        <h1 className="pb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                            3 Tokens
                                        </h1>
                                        <h1 className="pb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
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
                        <div className="w-2/5 pt-2 pb-4 overflow-scroll bg-white border border-gray-200 rounded-lg shadow-md">
                            <div className="flex flex-col items-center p-4">
                                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="space-y-4 md:space-y-6 sm:p-8">
                                        <h1 className="pb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                            5 Tokens
                                        </h1>
                                        <h1 className="pb-4 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
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
            )}
        </main>
    );
};
