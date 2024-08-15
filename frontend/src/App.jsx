import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./screens/Landing";
import { Dashboard } from "./screens/Dashboard";
import { Signup } from "./screens/Signup";
import { Settings } from "./screens/Settings";
import { Purchase } from "./screens/Purchase";
import { Test } from "./screens/Test";
import { Toaster } from "sonner";
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
                <Toaster richColors position="top-left" />
                {
                    <div className="">
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<Landing />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/settings"
                                    element={
                                        <ProtectedRoute>
                                            <Settings />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/purchase"
                                    element={
                                        <ProtectedRoute>
                                            <Purchase />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/test"
                                    element={
                                        <ProtectedRoute>
                                            <Test />
                                        </ProtectedRoute>
                                    }
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
