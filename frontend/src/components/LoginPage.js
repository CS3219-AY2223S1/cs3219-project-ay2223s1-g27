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
import axios from "axios";
import {URL_USER_SVC_LOGIN, URL_USER_SVC_RESETLINK} from "../configs";
import {
    STATUS_CODE_LOGIN, 
    STATUS_CODE_INVALID_USER, 
    STATUS_CODE_INCORRECT_PASSWORD,
    STATUS_CODE_MISSING_FIELD,
    STATUS_DATABASE_FAILURE,
} from "../constants";
import {Link, Navigate, useNavigate} from "react-router-dom";
import NavigationBar from "./NavigationBar";
import {jwtDecode} from "../util/auth"

function LoginPage() { 

    const [loginMessage, setLoginMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);  
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [resetUsername, setResetUsername] = useState(""); 
    const [resetEmail, setResetEmail] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);  
    const [isEmailValid, setIsEmailValid] = useState(null); 
    const [resetEmailSent, setResetEmailSent] = useState(null);  
    const [resetPasswordMessage, setResetPasswordMessage] = useState(""); 
    const [cookies, setCookie] = useCookies();

    /** Reset Password Logic */
    const handleDialog = () => {  
        console.log(isEmailValid);
        setIsDialogOpen(true);
    }

    const closeDialog = () => {
        setIsEmailValid(null);
        setIsDialogOpen(false);
        setResetUsername("");
        setResetEmail("");
    }

    const handleResetPassword = async(event) => {
        event.preventDefault();
        setResetEmailSent(false);
        const username = resetUsername; 
        const email = resetEmail;
        if (username === "" || email === "") {
            setResetEmailSent(false);  
            setResetPasswordMessage("Missing fields!");
            return;
        }
        const res = await axios.post(URL_USER_SVC_RESETLINK, { username, email })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 500 ) {
                    setResetEmailSent(false);  
                    setResetPasswordMessage(err.response.data.message);
                } 
            }) 
        if (res && res.status === 200) {
            setResetEmailSent(true);
            setResetPasswordMessage(res.data.message);
        } 
    }

    /** Login Logic */ 
    const navigate = useNavigate(); 
    const handleLogin = async(event) => {  
        event.preventDefault(); 
        setIsLoggedIn(false); 

        const res = await axios.post(URL_USER_SVC_LOGIN, { username, password })
            .catch((err) => {
                if (err.response.status === STATUS_CODE_INCORRECT_PASSWORD || 
                    err.response.status === STATUS_CODE_INVALID_USER ||
                    err.response.status === STATUS_CODE_MISSING_FIELD ||
                    err.response.status === STATUS_DATABASE_FAILURE ) {
                        setIsLoggedIn(false);
                        setLoginMessage(err.response.data.message);
                    } 
            })
        
        if (res && res.status === STATUS_CODE_LOGIN) {
            setIsLoggedIn(true);
            const accessToken = res.data.accessToken;
            const refreshToken = res.data.refreshToken;
            setCookie('access_token', accessToken, { path: '/',  expires: new Date(jwtDecode(accessToken).exp * 1000)});
            setCookie('refresh_token', refreshToken, {path: '/', expires: new Date(jwtDecode(refreshToken).exp * 1000)});
            navigate("/landing");
        } 
    }

    return cookies["refresh_token"]
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
                {isLoggedIn ? <div> Login success! </div> : <div style={{ color: "red" }}>{loginMessage}</div>}
            </div>

            <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth={"xs"}>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Username" 
                        value={resetUsername}
                        onChange={(e) => setResetUsername(e.target.value)}
                        fullWidth
                        variant="standard"
                        sx={{ marginBottom: "1rem" }} />
                    <TextField
                        autoFocus
                        label="Email Address"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        fullWidth
                        variant="standard"
                        sx={{ marginBottom: "1rem" }} /> 
                    <div>
                        {resetEmailSent ? <div style={{ color: "blue" }}> {resetPasswordMessage} </div>
                                : resetEmailSent === false ? <div style={{ color: "red" }}>{resetPasswordMessage}</div>
                                    : <div></div>} 
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    {/* Click on "Reset Password" triggers sending of email and success message as well */}
                    <Button onClick={handleResetPassword}>Send Reset Link</Button>
                </DialogActions>
            </Dialog>
        </Box>
        </>  
    )
}

export default LoginPage;
