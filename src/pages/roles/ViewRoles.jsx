import React from "react";
import { useParams } from "react-router-dom";
import RoleFormCard from "./RoleFormCard";

const ViewRoles = () => {
  const { id } = useParams();
  return <RoleFormCard mode="view" id={id} />;
};

export default ViewRoles;
