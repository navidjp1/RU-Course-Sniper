import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./screens/Landing";
import { Dashboard } from "./screens/Dashboard";
import { Signup } from "./screens/Signup";
import { Settings } from "./screens/Settings";
import { Purchase } from "./screens/Purchase";
import { PageNotFound } from "./screens/PageNotFound";
import { Toaster } from "sonner";
import { MantineProvider } from "@mantine/core";
import { AuthProvider } from "./contexts/authContext";
import { ProtectedRoute, AuthRoute } from "./components/RedirectRoute";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

function App() {
    return (
        <AuthProvider>
            <MantineProvider>
                <Toaster
                    richColors
                    position="top-left"
                    toastOptions={{
                        className: "font-body",
                    }}
                />
                {
                    <div className="font-body">
                        <BrowserRouter>
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <AuthRoute>
                                            <Landing />
                                        </AuthRoute>
                                    }
                                />
                                <Route
                                    path="/signup"
                                    element={
                                        <AuthRoute>
                                            <Signup />
                                        </AuthRoute>
                                    }
                                />
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
                                {/* <Route
                                    path="/purchase"
                                    element={
                                        <ProtectedRoute>
                                            <Purchase />
                                        </ProtectedRoute>
                                    }
                                /> */}
                                <Route path="*" element={<PageNotFound />} />
                            </Routes>
                        </BrowserRouter>
                    </div>
                }
            </MantineProvider>
        </AuthProvider>
    );
}

export default App;
