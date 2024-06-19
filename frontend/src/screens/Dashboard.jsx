import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Popup from "../components/Popup";
import { Dialog, DialogPanel } from "@headlessui/react";

export const Dashboard = () => {
    const [buttonPopup, setButtonPopup] = useState(false);

    return (
        <div className="dashboard">
            <main>
                <h2 className="text-3xl font-bold mb-4">
                    Hi and welcome to the dashboard
                </h2>
                <br />
                <button className="mb-8" onClick={() => setButtonPopup(true)}>
                    Add Course
                </button>
            </main>
            <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <h3>My Popup</h3>
            </Popup>
            <br />
            <Link to="/settings">Settings</Link>
        </div>
    );
};
