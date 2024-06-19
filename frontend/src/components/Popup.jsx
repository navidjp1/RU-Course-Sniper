import React from "react";

function Popup(props) {
    return props.trigger ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 md:w-1/2 lg:w-1/3">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Popup Title</h2>
                    <button
                        className="text-gray-700 hover:text-gray-900 focus:outline-none"
                        onClick={() => props.setTrigger(false)}
                    >
                        &#x2715;
                    </button>
                    {props.children}
                </div>
            </div>
        </div>
    ) : (
        ""
    );
}

export default Popup;
