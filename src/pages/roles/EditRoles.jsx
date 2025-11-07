import React from "react";
import { useParams } from "react-router-dom";
import RoleFormCard from "./RoleFormCard";

const EditRoles = () => {
  const { id } = useParams();
  return <RoleFormCard mode="edit" id={id} />;
};

export default EditRoles;
