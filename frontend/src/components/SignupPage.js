import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC_CREATEUSER } from "../configs";
import { STATUS_CODE_INVALID_SIGNUP, STATUS_CODE_CREATED } from "../constants";
import { Link } from "react-router-dom";
import NavigationBar from "./NavigationBar";

function SignupPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState("")
  const [dialogMsg, setDialogMsg] = useState("")
  const [isSignupSuccess, setIsSignupSuccess] = useState(false)

  const handleSignup = async () => {
    setIsSignupSuccess(false)
    const res = await axios.post(URL_USER_SVC_CREATEUSER, { username, password, email })
      .catch((err) => {
        if (err.response.status === STATUS_CODE_INVALID_SIGNUP) {
          setErrorDialog(err.response.data.message)
        }
      })

    if (res && res.status === STATUS_CODE_CREATED) {
      setSuccessDialog(res.data.message)
      setIsSignupSuccess(true)
    }
  }

  const closeDialog = () => setIsDialogOpen(false)

  const setSuccessDialog = (msg) => {
    setIsDialogOpen(true)
    setDialogTitle('Success')
    setDialogMsg(msg)
  }

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true)
    setDialogTitle('Error')
    setDialogMsg(msg)
  }

  return (
    <>
      <NavigationBar isAuthenticated={false} />
      <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} >
        <Box display={"flex"} flexDirection={"column"} width={"30%"} style={{ marginTop: "8%" }} sx={{ boxShadow: 1, px: 5, py: 8, borderRadius: 5 }}>
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
            <h1 style={{ fontSize: '50px', marginBottom: "3%", color: '#5465FF' }}>Sign Up</h1>
          </Box>
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: "1rem" }}
            autoFocus
          />
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: "1rem" }}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: "2rem" }}
          />
          <div>
            Already have an account? Log in {' '}
            <Link className="text-blue-600 hover:text-blue-800 visited:text-purple-600" to="/login">here</Link>!
          </div>
          <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
            <Button variant={"outlined"} onClick={handleSignup}>Sign up</Button>
          </Box>

          <Dialog
            open={isDialogOpen}
            onClose={closeDialog}
          >
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText>{dialogMsg}</DialogContentText>
            </DialogContent>
            <DialogActions>
              {isSignupSuccess
                ? <Button component={Link} to="/login">Log in</Button>
                : <Button onClick={closeDialog}>Done</Button>
              }
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  )
}

export default SignupPage;
