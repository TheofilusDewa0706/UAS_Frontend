import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContexts";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth(); // Ambil user dari AuthContext

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
