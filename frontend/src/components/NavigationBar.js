import {
    AppBar,
    Box, 
    Button, 
    Toolbar,
    Typography,
    IconButton, 
    MenuItem,
    Menu,
    Modal,
    TextField
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import {useState} from 'react';
import { useCookies } from 'react-cookie';
 
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper', 
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
  }; 

function NavigationBar({ isAuthenticated }) {
    const [,,removeCookie] = useCookies(["access_token", "refresh_cookie"]);
    // const [auth, setAuth] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [changePassword, setChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [deleteAccount, setDeleteAccount] = useState(false); 
    const [logOut, setLogOut] = useState(false);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };  
    
    const handleChangePassword = () => {
        setAnchorEl(null);
        setChangePassword(true);
    };

    const handleDeleteAccount = () => {
        setAnchorEl(null);
        setDeleteAccount(true);
    };

    const handleLogOut = async () => {
        setAnchorEl(null);
        setLogOut(true); 
    } 

    const handleCloseChangePassword = () => {
        setChangePassword(false);
        setNewPassword("");
    }

    const handleCloseDeleteAccount = () => {
        setDeleteAccount(false); 
    }

    const handleCloseLogOut = () => {
        setLogOut(false);
    }
 
    const handleChangePasswordOnClick = () => {
        setAnchorEl(null);
        // Triggers change password! 
    } 

    const handleDeleteAccountOnClick = () => {
        setAnchorEl(null);
        removeCookie("access_token");
        removeCookie("refresh_token");
        // Triggers account deletion!
    }

    return(
        <Box sx={{ flexGrow: 1 }}> 
            <AppBar style={{ margin: 0 }} position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        CS3219
                    </Typography>
                    {isAuthenticated && (
                        <div>
                            <IconButton 
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenMenu}
                                color="inherit"
                            >
                                <AccountCircleIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseMenu}
                                >
                                <MenuItem onClick={handleChangePassword}>Change Password</MenuItem>
                                <MenuItem onClick={handleDeleteAccount}>Delete Account</MenuItem>
                                <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
                            </Menu>

                            {/* Change Password Modal */}
                            <Modal 
                                open={changePassword}  
                                onClose={handleCloseChangePassword}
                                aria-labelledby="modal-modal-title" 
                            >
                                <Box sx={modalStyle}>
                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}> 
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            Change Password
                                        </Typography>
                                        <IconButton onClick={handleCloseChangePassword}> 
                                            <CloseIcon/>
                                        </IconButton>
                                    </Box>
                                    <TextField
                                        id="outlined-password-input"
                                        label="Password"
                                        type="password"
                                        variant="outlined"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        sx={{marginTop: "1rem", marginBottom: "1rem"}}
                                        autoFocus
                                    /> 
                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"flexStart"} style={{ paddingTop: "5%"}}>
                                        <Button variant={"contained"} onClick={handleChangePasswordOnClick}>Confirm New Password</Button>
                                    </Box>
                                </Box>
                            </Modal>

                            {/* Delete Account Modal */}
                            <Modal 
                                open={deleteAccount}  
                                onClose={handleCloseDeleteAccount}
                                aria-labelledby="modal-modal-title" 
                            >
                                <Box sx={modalStyle}>
                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}> 
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            Delete Account
                                        </Typography>
                                        <IconButton onClick={handleCloseDeleteAccount}> 
                                            <CloseIcon/>
                                        </IconButton>
                                    </Box> 
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        This action is permanent and cannot be undone. If you're sure that you want to delete your account, please press "Confirm".
                                    </Typography>
                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"flexStart"} style={{ paddingTop: "5%"}}>
                                        <Button variant={"contained"} onClick={handleDeleteAccountOnClick}>Confirm</Button>
                                    </Box>
                                </Box>
                            </Modal>

                            {/* Log Out Modal */}
                            <Modal 
                                open={logOut} 
                                aria-labelledby="modal-modal-title" 
                            >
                                <Box sx={modalStyle}>
                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}> 
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Log Out
                                        </Typography> 
                                        <IconButton onClick={handleCloseLogOut}> 
                                            <CloseIcon/>
                                        </IconButton>
                                    </Box> 
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        Do you wish to end your session? 
                                    </Typography>
                                    <Box display={"flex"} flexDirection={"row"} justifyContent={"flexStart"} style={{ paddingTop: "5%"}}>
                                        <Button variant={"contained"} href='/login' onClick={handleDeleteAccountOnClick}>Back to Login Page</Button>
                                    </Box>
                                </Box>
                            </Modal>
                                
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NavigationBar;
