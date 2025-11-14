import React, { useContext } from "react";
import { userContext } from "../context/userContext";
import { Navigate, Outlet } from "react-router-dom";

const RoleProtectedRoute = ({allowedPermissions}) => {
  
  const { user, loading } = useContext(userContext);

 
  if (loading) return <div>loading...</div>;


  if (!user) return <Navigate to="/sign-in" replace />;


  return allowedPermissions ? (
    <Outlet />
  ) : (
    <Navigate to="/unauthorized" replace />
  );
};

export default RoleProtectedRoute;
