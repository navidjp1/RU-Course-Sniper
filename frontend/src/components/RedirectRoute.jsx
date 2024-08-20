import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export const ProtectedRoute = ({ children }) => {
    const { userLoggedIn } = useAuth();

    return userLoggedIn ? children : <Navigate to="/"></Navigate>;
};

export const AuthRoute = ({ children }) => {
    const { userLoggedIn } = useAuth();

    return !userLoggedIn ? children : <Navigate to="/dashboard"></Navigate>;
};
