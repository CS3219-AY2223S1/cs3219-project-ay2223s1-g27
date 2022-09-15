import { getJwtToken } from "../services/auth";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
    console.log(getJwtToken());
    return getJwtToken() ? children : <Navigate to="/login" />;
};
