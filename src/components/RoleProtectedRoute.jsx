import React, { useContext } from "react";
import { userContext } from "../context/userContext";
import { Navigate, Outlet } from "react-router-dom";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(userContext);

  // ✅ 1. Wait until token verification is complete
  if (loading) return <div>loading...</div>;

  // ✅ 2. If token expired → userContext sets user = null → redirect
  if (!user) return <Navigate to="/sign-in" replace />;

  // ✅ 3. Role check
  return allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export default RoleProtectedRoute;
