import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent, 
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import {useCookies} from 'react-cookie'
import {useState} from "react";
import {useNavigate, Navigate} from 'react-router-dom';
import axios from "axios";
import {URL_USER_SVC_LOGIN} from "../configs";
import {
    STATUS_CODE_LOGIN, 
    STATUS_CODE_INVALID_USERNAME, 
    STATUS_CODE_INVALID_PASSWORD,
    STATUS_CODE_MISSING,
    // STATUS_DATABASE_FAILURE
} from "../constants";
import {Link} from "react-router-dom";
import NavigationBar from "./NavigationBar";
import { jwtDecode } from "../util/auth";

function LoginPage() {

    // To be deleted: temporary database for testing UI
    const database = [
        {
            email: "user1@gmail.com",
            username: "user1",
            password: "pass1"
        },
        {
            email: "user2@gmail.com",
            username: "user2",
            password: "pass2"
        }
    ] 

    const errors = {
        username: "Invalid username!",
        password: "Invalid password!", 
        missing: "Username and/or password are missing!",
        failure: "Database failure when retrieving user!",
        invalidEmail: "Email has not been registered!",
    } 

    const navigate = useNavigate();
    const [errorMessages, setErrorMessages] = useState({}); 
    const [isLoggedIn, setIsLoggedIn] = useState(false);  
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false);  
    const [isEmailValid, setIsEmailValid] = useState(null); 
    const [cookies, setCookie] = useCookies(['access_token', 'refresh_token']);

    /** Reset Password Logic */
    const handleDialog = () => {  
        console.log(isEmailValid);
        setIsDialogOpen(true);
    }

    const closeDialog = () => {
        setIsEmailValid(null);
        setIsDialogOpen(false);
    }

    const handleReset = (event) => {
        event.preventDefault();
        const userEmail = database.find((user) => user.email === email)
        if (userEmail) {
            setIsEmailValid(true);
            console.log("True");
        } else {
            setIsEmailValid(false);
            console.log("False");
        }
    }

    /** Login Logic */ 
    const handleLogin = async(event) => {  
        event.preventDefault(); 
        setIsLoggedIn(false); 

        const res = await axios.post(URL_USER_SVC_LOGIN, { username, password })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_INVALID_USERNAME) {
                    setErrorMessages({ name: "username", message: errors.username});
                } else if (err.response.status === STATUS_CODE_INVALID_PASSWORD) {
                    setErrorMessages({ name: "password", message: errors.password});
                } else if (err.response.status === STATUS_CODE_MISSING) {
                    setErrorMessages({ name: "missing", message: errors.missing});
                } else {
                    setErrorMessages({ name: "failure", message: errors.failure});
                }
            })
        
        if (res && res.status === STATUS_CODE_LOGIN) {
            setIsLoggedIn(true);
            const accessToken = jwtDecode(res.data.accessToken);
            const refreshToken = jwtDecode(res.data.refreshToken);
            setCookie('access_token', accessToken, { path: '/',  expires: new Date(accessToken.exp * 1000)});
            setCookie('refresh_token', refreshToken, {path: '/', expires: new Date(refreshToken.exp * 1000)}); 
            navigate("/landing");
        }

        // To be deleted: temporary checks for testing UI
        if (username === "" || password === "") {
            setErrorMessages({ name: "missing", message: errors.missing});
        } else {
            const userData = database.find((user) => user.username === username);  
            if (userData) { 
                if (userData.password !== password) {
                    setErrorMessages({ name: "password", message: errors.password});
                } else {
                    setIsLoggedIn(true);
                }
            } else {  
                setErrorMessages({ name: "username", message: errors.username});
            }
        } 
    }

    return cookies["access_token"]
        ? <Navigate to="/landing" /> 
        : (  
        <>
        <NavigationBar isAuthenticated={false} /> 
        <Box display={"flex"} flexDirection={"column"} width={"30%"} style={{marginTop: "3%", marginLeft: "3%"}}>
            <Typography variant={"h3"} marginBottom={"2rem"}>Login</Typography>
            <TextField
                label="Username"
                variant="standard"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: "1rem" }}
                autoFocus />
            <TextField
                label="Password"
                variant="standard"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: "2rem" }} /> 
            <div style={{ marginBottom: "5px" }} >
                Do not have an account? Sign up {' '}
                <Link to="/signup">here!</Link>
            </div>

            <div>
                Forget your password? Reset it {' '}
                <Link onClick={handleDialog} to="">here!</Link>
            </div>

            <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                <Button variant={"outlined"} onClick={handleLogin}>Login</Button>
            </Box>

            <div>
                {isLoggedIn ? <div> Login success! </div> : <div style={{ color: "red" }}>{errorMessages.message}</div>}
            </div>

            <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth={"xs"}>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        variant="standard"
                        sx={{ marginBottom: "2rem" }} />
                    <div>
                        {isEmailValid ? <div style={{ color: "blue" }}> A link to reset your password has been sent to your email! </div>
                            : isEmailValid === false ? <div style={{ color: "red" }}>{errors.invalidEmail}</div>
                                : <div></div>}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    {/* Click on "Reset Password" triggers sending of email and success message as well */}
                    <Button onClick={handleReset}>Reset Password</Button>
                </DialogActions>
            </Dialog>
        </Box>
        </>  
    )
}

export default LoginPage;
