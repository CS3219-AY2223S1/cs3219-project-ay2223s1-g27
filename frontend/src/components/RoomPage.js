import {
    Box,
    Button,
    Typography
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CodeEditorLanding from "./editor/CodeEditorLanding";
import NavigationBar from "./NavigationBar";  
import LogoutIcon from '@mui/icons-material/Logout';

function RoomPage() {
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location.state.difficultyLevel)

    const handleLeaveSession = () => {
        navigate("/landing", {state: { user: location.state.user }});
    }

    return (
        <>
            <NavigationBar isAuthenticated={true} user={location.state.user} />
            <div> 
                <Typography sx={{marginLeft: "3%", marginTop: "1%", marginBottom: "-2%"}} variant={"h3"} marginBottom={"2rem"}>Coding Room</Typography>   
                <Box display={"flex"} flexDirection={"column"} style={{ marginTop: "3%", marginLeft: "3%", marginRight: "3%" }}>
                    <CodeEditorLanding/>
                </Box>
                <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} sx={{marginRight: "3%", marginBottom: "10px"}}> 
                    <Button 
                        variant="contained" 
                        style={{ textTransform: "none", background: "#c61a09", fontSize: "15px", fontWeight: "bold", borderRadius: "7px"}} 
                        endIcon={<LogoutIcon/>} 
                        onClick={handleLeaveSession}>
                            End Session
                    </Button>
                </Box>
            </div>
            
            

        </>
    )
}

export default RoomPage;
