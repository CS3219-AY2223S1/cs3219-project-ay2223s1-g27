import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import SignupPage from './components/SignupPage'; 
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import MatchingPage from "./components/MatchingPage"; 
// import NavigationBar from "./components/NavigationBar"; 
import {Box} from "@mui/material"; 
import { PrivateRoute } from "./components/PrivateRoute";
import RoomPage from "./components/RoomPage";
import { initAxiosApiInstance } from "./axiosApiInstance";
import { useCookies } from "react-cookie";
import { PREFIX_FRONTEND_LANDING, PREFIX_FRONTEND_LOGIN, PREFIX_FRONTEND_MATCHING, PREFIX_FRONTEND_ROOM, PREFIX_FRONTEND_ROOT, PREFIX_FRONTEND_SIGNUP } from "./configs";
 
function App() {
    const [, setCookie] = useCookies();
    initAxiosApiInstance(setCookie);
    return (
        <div className="App">
            {/* <NavigationBar isAuthenticated={true}/> */}
            <Box display={"flex"} flexDirection={"column"} >
                <Router>
                    <Routes>
                        <Route exact path={PREFIX_FRONTEND_ROOT} element={<Navigate replace to="/login"/>}></Route>
                        <Route path={PREFIX_FRONTEND_SIGNUP} element={<SignupPage/>}/> 
                        <Route path={PREFIX_FRONTEND_LOGIN} element={<LoginPage/>}/>
                        <Route path={PREFIX_FRONTEND_LANDING} element={<PrivateRoute><LandingPage/></PrivateRoute>}/> 
                        <Route path={PREFIX_FRONTEND_MATCHING} element={<MatchingPage/>}/>
                        <Route path={PREFIX_FRONTEND_ROOM} element={<RoomPage/>}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
