import {
    Box,
    Button,
    Typography
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CodeEditorLanding from "./editor/CodeEditorLanding";
import NavigationBar from "./NavigationBar";  
import ChatWindow from "./chat/ChatWindow";

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
            <Box display={"flex"} flexDirection={"column"} width={"90%"} style={{ marginTop: "3%", marginLeft: "3%" }}>
                <Typography variant={"h3"} marginBottom={"2rem"}>Room Page</Typography>
                <CodeEditorLanding/>
                <ChatWindow/>
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
