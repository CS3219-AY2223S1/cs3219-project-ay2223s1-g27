import {
    Box,
    Button,
    Typography
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";  

function RoomPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLeaveSession = () => {
        navigate("/landing", {state: { user: location.state.user }});
    }
    
    return (
        <>
            <NavigationBar isAuthenticated={true} user={location.state.user} />
            <Box display={"flex"} flexDirection={"column"} width={"30%"} style={{ marginTop: "3%", marginLeft: "3%" }}>
                <Typography variant={"h3"} marginBottom={"2rem"}>// Room Page //</Typography>
                <Box> 
                    <Button variant="contained" onClick={handleLeaveSession}>
                        Leave Session
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default RoomPage;