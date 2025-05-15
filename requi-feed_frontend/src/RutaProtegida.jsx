import React from "react";
import { Navigate } from "react-router-dom";
import { get } from "./hooks/SessionUtil";

const RutaProtegida = ({ children }) => {
  const token = get("token");
  return token ? children : <Navigate to="/Login" replace />;
};

export default RutaProtegida;
