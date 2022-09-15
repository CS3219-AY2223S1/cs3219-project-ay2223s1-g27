import { useCookies } from 'react-cookie';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }) => {
    const [cookies] = useCookies(["access_token"]);
    return cookies["access_token"] ? children : <Navigate to="/login" />;
};
