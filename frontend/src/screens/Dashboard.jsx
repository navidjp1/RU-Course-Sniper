import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCourse from "../components/AddCourse";
import axios from "axios";

export const Dashboard = () => {
    return (
        <main className="App">
            <AddCourse />
        </main>
    );
};
