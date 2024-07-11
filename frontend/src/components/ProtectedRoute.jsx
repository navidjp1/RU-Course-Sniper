import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext/authContext";

export const ProtectedRoute = ({ children }) => {
    const { userLoggedIn } = useAuth();

    return userLoggedIn ? children : <Navigate to="/"></Navigate>;
};
