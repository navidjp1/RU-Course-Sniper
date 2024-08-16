import React, { useState } from "react";

const MultipleInputs = ({ inputs, setInputs }) => {
    const [currentInput, setCurrentInput] = useState("");
    const [errorMsg, setErrorMsg] = useState("No error");

    const handleKeyDown = (e) => {
        if ([" ", ",", "Enter"].includes(e.key) && currentInput.trim() !== "") {
            e.preventDefault();
            addInput(currentInput.trim());
        }
    };

    const addInput = (input) => {
        if (inputs.length >= 5) {
            setErrorMsg("Maximum of 5 inputs reached");
        } else if (isNaN(input)) {
            setErrorMsg("Please enter a 5 digit number");
        } else if (input.match(/^[/\d]{5}?$/) == null) {
            setErrorMsg("Index must be exactly 5 digits");
        } else {
            setInputs([...inputs, input]);
            setErrorMsg("No error");
            setCurrentInput("");
        }
    };

    const removeInput = (index) => {
        setInputs(inputs.filter((_, i) => i !== index));
    };

    return (
        <div className="rounded-lg">
            <div className="flex flex-wrap gap-2">
                {inputs.map((input, index) => (
                    <div
                        key={index}
                        className="flex items-center px-3 py-1 mb-2 text-white bg-gray-500 rounded-full"
                    >
                        <span className="mr-2">{input}</span>
                        <button
                            onClick={() => removeInput(index)}
                            className="text-sm font-bold"
                            type="button"
                        >
                            &times;
                        </button>
                    </div>
                ))}
            </div>
            <div className="">
                <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter course indices to drop, seperated by commas or spaces (max 5)"
                    className="justify-start shadow-md rounded-lg w-full p-2.5 border-gray-600 outline-none mb-2 placeholder-gray-400 text-white "
                />
                <p
                    className={`mb-4 text-sm ${
                        errorMsg !== "No error" ? "text-red-500" : "text-transparent"
                    }`}
                >
                    {errorMsg}
                </p>
            </div>
        </div>
    );
};

export default MultipleInputs;
