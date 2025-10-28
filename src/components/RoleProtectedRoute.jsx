import React, { useContext } from "react";
import { userContext } from "../context/userContext";
import { Navigate, Outlet } from "react-router-dom";

const RoleProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(userContext);

  if (!user || !user.username) return <Navigate to="/sign-in" replace />;
  if(loading){
    return <div>loading...</div>
  }
  return allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export default RoleProtectedRoute;
