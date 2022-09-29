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
 
function App() {
    const [cookies, setCookie] = useCookies();
    initAxiosApiInstance(cookies, setCookie);
    return (
        <div className="App">
            {/* <NavigationBar isAuthenticated={true}/> */}
            <Box display={"flex"} flexDirection={"column"} >
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/login"/>}></Route>
                        <Route path="/signup" element={<SignupPage/>}/> 
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/landing" element={<PrivateRoute><LandingPage/></PrivateRoute>}/> 
                        <Route path="/matching" element={<MatchingPage/>}/>
                        <Route path="/room" element={<RoomPage/>}/>
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
