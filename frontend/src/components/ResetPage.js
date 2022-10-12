import {
    Box,
    Button, 
    TextField,
    Typography
} from "@mui/material"; 
import {useState} from "react";  
import {URL_USER_SVC_RESETPASSWORD} from "../configs";
import {Link, useLocation} from "react-router-dom";
import axios from "axios"; 

function ResetPage() { 
    const location = useLocation();
    const [username, setUsername] = useState("");
    const [passwordOne, setPasswordOne] = useState("");
    const [passwordTwo, setPasswordTwo] = useState("");
    const [message, setMessage] = useState(""); 
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState(null);

    const handleResetPassword = async(event) => { 
        if (passwordOne === "" || passwordTwo === "") { 
            setMessage("Please fill in both fields."); 
            setResetPasswordSuccess(false);
            return;
        } 
        
        if (passwordOne !== passwordTwo) { 
            setMessage("Passwords do not match."); 
            setResetPasswordSuccess(false);
            return;
        }  

        event.preventDefault();  
        const newPassword = passwordOne; 
        const resetId = location.pathname.split("/")[2]; // Assuming path is /resetpassword/<resetId>
        console.log(resetId);
        // const resetId = '63359616bb634f2cbee5ec0c'; // username: johndoe, email: johndoe.cs3219@gmail.com
        const res = await axios.put(URL_USER_SVC_RESETPASSWORD, { username, resetId, newPassword })
            .catch((err) => {
                if (err.response.status === 400 || err.response.status === 401 || err.response.status === 500) {
                    setResetPasswordSuccess(false);  
                    setMessage(err.response.data.message); 
                } 
            })

        if (res && res.status === 200) {
            setResetPasswordSuccess(true);
            setMessage(res.data.message);
            console.log(res.data.message);
        } 
    }

    return (
        <Box display={"flex"} flexDirection={"column"} width={"30%"} style={{marginTop: "3%", marginLeft: "3%"}}>
            <Typography variant={"h3"} marginBottom={"2rem"}>Reset Password</Typography> 
            <TextField
                label="Username"
                variant="standard"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: "1rem" }} />  
            <TextField
                label="New Password"
                variant="standard"
                type="password"
                value={passwordOne}
                onChange={(e) => setPasswordOne(e.target.value)}
                sx={{ marginBottom: "1rem" }} />  
            <TextField
                label="Confirm New Password"
                variant="standard"
                type="password"
                value={passwordTwo}
                onChange={(e) => setPasswordTwo(e.target.value)}
                sx={{ marginBottom: "2rem" }} />  
            <div style={{ marginBottom: "5px" }} > 
                <Link to="/login">Back to Login</Link>
            </div>
            <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                <Button variant={"outlined"} onClick={handleResetPassword}>Reset</Button>
            </Box> 
            <div> 
                {resetPasswordSuccess ? <div style={{ color: "blue" }}> {message} </div>
                        : resetPasswordSuccess === false ? <div style={{ color: "red" }}>{message}</div>
                            : <div></div>} 
            </div>
        </Box>
    );
}

export default ResetPage;