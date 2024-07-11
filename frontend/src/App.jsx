import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./screens/Landing";
import { Dashboard } from "./screens/Dashboard";
import { Signup } from "./screens/Signup";
import { Settings } from "./screens/Settings";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./contexts/authContext/authContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

function App() {
    const [count, setCount] = useState(0);

    return (
        <AuthProvider>
            <MantineProvider>
                {
                    <div className="bg-slate-800">
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<Landing />} />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="/signup" element={<Signup />} />
                                <Route
                                    path="/settings"
                                    element={<Settings />}
                                />
                            </Routes>
                        </BrowserRouter>
                    </div>
                }
            </MantineProvider>
        </AuthProvider>
    );
}

export default App;
