import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage'; 
import AttemptsPage from './components/AttemptsPage';
import MatchingPage from "./components/MatchingPage"; 
import ResetPage from "./components/ResetPage"; 
// import NavigationBar from "./components/NavigationBar"; 
import { Box } from "@mui/material";
import { PrivateRoute } from "./components/PrivateRoute";
import RoomPage from "./components/RoomPage";
import { initAxiosApiInstance } from "./axiosApiInstance";
import { useCookies } from "react-cookie"; 
import {
    PREFIX_FRONTEND_ATTEMPTS,
    PREFIX_FRONTEND_LANDING, 
    PREFIX_FRONTEND_LOGIN, 
    PREFIX_FRONTEND_MATCHING, 
    PREFIX_FRONTEND_ROOM, 
    PREFIX_FRONTEND_ROOT, 
    PREFIX_FRONTEND_SIGNUP,
    PREFIX_FRONTEND_RESETPWD
} from "./configs";
import background from "./img/background-img.png";
 
function App() {
    const [, setCookie] = useCookies();
    initAxiosApiInstance(setCookie);

    // Background image from <a href="https://www.freepik.com/free-vector/white-gray-geometric-pattern-background-vector_18240979.htm#query=white%20texture%20background&position=4&from_view=search&track=sph">Image by rawpixel.com</a> on Freepik
    return (
        <div className="App" style={{ 
            backgroundImage: `url(${background})`,
            height:'100vh',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            }}>
            {/* <NavigationBar isAuthenticated={true}/> */}
            <Box display={"flex"} style={{ height: "100%" }} flexDirection={"column"} >
                <Router>
                    <Routes>
                        <Route exact path={PREFIX_FRONTEND_ROOT} element={<Navigate replace to="/login"/>}></Route>
                        <Route path={PREFIX_FRONTEND_SIGNUP} element={<SignupPage/>}/> 
                        <Route path={PREFIX_FRONTEND_LOGIN} element={<LoginPage/>}/>
                        <Route path={PREFIX_FRONTEND_RESETPWD + '/:id'} element={<ResetPage/>}/>
                        <Route path={PREFIX_FRONTEND_LANDING} element={<PrivateRoute><LandingPage/></PrivateRoute>}/> 
                        <Route path={PREFIX_FRONTEND_ATTEMPTS} element={<PrivateRoute><AttemptsPage/></PrivateRoute>}/> 
                        <Route path={PREFIX_FRONTEND_MATCHING} element={<MatchingPage/>}/>
                        <Route path={PREFIX_FRONTEND_ROOM} element={<RoomPage/>}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    ); 
}

export default App;
