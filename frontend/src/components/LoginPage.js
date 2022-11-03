import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useCookies } from 'react-cookie'
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC_LOGIN, URL_USER_SVC_RESETLINK } from "../configs";
import {
  STATUS_CODE_LOGIN,
  STATUS_CODE_INVALID_USER,
  STATUS_CODE_INCORRECT_PASSWORD,
  STATUS_CODE_MISSING_FIELD,
  STATUS_DATABASE_FAILURE,
} from "../constants";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "../util/auth"
import { TypeAnimation } from 'react-type-animation'

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
  const [loginProcessing, setloginProcessing] = useState(false);
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

  const handleResetPassword = async (event) => {
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
        if (err.response.status === 400 || err.response.status === 500) {
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
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoggedIn(false);
    setloginProcessing(true)

    const res = await axios.post(URL_USER_SVC_LOGIN, { username, password })
      .catch((err) => {
        setloginProcessing(false)
        if (err.response.status === STATUS_CODE_INCORRECT_PASSWORD ||
          err.response.status === STATUS_CODE_INVALID_USER ||
          err.response.status === STATUS_CODE_MISSING_FIELD ||
          err.response.status === STATUS_DATABASE_FAILURE) {
          setIsLoggedIn(false);
          setLoginMessage(err.response.data.message);
        }
      })

    if (res && res.status === STATUS_CODE_LOGIN) {
      setIsLoggedIn(true);
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      setCookie('access_token', accessToken, { path: '/', expires: new Date(jwtDecode(accessToken).exp * 1000) });
      setCookie('refresh_token', refreshToken, { path: '/', expires: new Date(jwtDecode(refreshToken).exp * 1000) });
      navigate("/landing");
    }
    setloginProcessing(false)
  }

  return cookies["refresh_token"]
    ? <Navigate to="/landing" />
    : (
      <>
        <Box display={'flex'} flexDirection={"row"} sx={{ height: "100%", width: "100%", position: 'absolute' }}>
          {/* Description of Application */}
          <Box style={{ width: "50%", height: "100%" }}>
            <Box style={{ marginTop: "25%", marginLeft: "10%" }}>
              <h1 className="font-extrabold text-transparent text-5xl bg-clip-text bg-gradient-to-r from-blue-400 to-teal-200 leading-normal mt-2 mb-2 mx-2">
                Prepare for coding interviews
              </h1>
              <h2 className="text-2xl font-normal leading-normal mt-5 mb-0 mx-2 text-slate-400">
                PeerPrep aims to help you
              </h2>
              <TypeAnimation
                sequence={[
                  'boost your technical interview skills',
                  1000,
                  'level up your programming skills',
                  1000,
                  'enhance your familiarity with technical interviews',
                  1000,
                  'land your dream jobs',
                  1000
                ]}
                speed={70}
                repeat={Infinity}
                wrapper="h2"
                className="text-2xl font-normal leading-normal mt-0 mb-2 mx-2 text-slate-400"
              />
            </Box>
          </Box>
          <Box style={{ width: "50%", height: "100%" }}>
            <Box style={{ marginTop: "20%", marginLeft: "20%", width: "60%" }} sx={{ boxShadow: 1, px: 5, py: 8, borderRadius: 5 }}>
              <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
                <h1 style={{ fontSize: '50px', marginBottom: "3%", color: '#5465FF' }} >Login</h1>
              </Box>
              <Box display={'flex'} flexDirection={"column"}>
                <TextField
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ marginBottom: "1rem" }}
                  autoFocus />
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ marginBottom: "2rem" }} />
              </Box>

              <div style={{ marginBottom: "5px" }} >
                Do not have an account? Sign up {' '}
                <Link className="text-blue-600 hover:text-blue-800 visited:text-purple-600" to="/signup">here</Link>!
              </div>

              <div>
                Forget your password? Reset it {' '}
                <Link className="text-blue-600 hover:text-blue-800 visited:text-purple-600" onClick={handleDialog} to="">here</Link>!
              </div>

              <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} sx={{ my: 2 }}>
                <div>
                  {loginProcessing
                    ? <CircularProgress />
                    : <Button variant={"outlined"} onClick={handleLogin}>Login</Button>}
                </div>
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
          </Box>


        </Box>


      </>
    )
}

export default LoginPage;
