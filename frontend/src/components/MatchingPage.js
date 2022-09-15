import {CountdownCircleTimer} from "react-countdown-circle-timer";
import NavigationBar from "./NavigationBar"; 
import {io} from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box, 
    Button,
    Modal,
    Typography
} from "@mui/material";
import {useState} from "react"; 

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

const buttonStyle = {
    textTransform: 'none', 
    fontSize: '15px',
    width: '100%'
    
}
 
function MatchingPage() { 
    const location = useLocation(); // Location contains username and selected difficulty level
    const navigate = useNavigate();
    const socket = io('http://localhost:8001', { transports: ['websocket'] });

    // Emit matching event here
    socket.emit('match', { username: location.state.user, difficulty: location.state.difficultyLevel });
    
    // Listen to matchSuccess event
    socket.once('matchSuccess', (data) => {
        console.log('matchSuccess');
        console.log(data.message);
        console.log(data.room_id);
        socket.removeAllListeners();  
        handleMatchFound();
    })

    // Listen to matchFail event
    socket.once('matchFail', (data) => {
        console.log('matchFail');
        console.log(data.message);  
        socket.removeAllListeners(); 
        handleNoMatchFound();
    }) 

    const [isMatchFound, setIsMatchFound] = useState(null);
    const [key, setKey] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [waitForMatch, setWaitForMatch] = useState(true);

    const renderTime = ({ remainingTime }) => {
        return (
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems:"center"}}>
                <div style={{color: "#b3b3b3"}}> Remaining </div> 
                <div style={{fontSize: "60px", fontWeight: "bold"}}> {remainingTime} </div> 
                <div style={{color: "#b3b3b3"}}> seconds </div>
            </div>
        ); 
    };
     
    const handleMatchFound = () => {
        setIsMatchFound(true);
        navigate("/room", {state: { user: location.state.user }});
    }

    const handleNoMatchFound = () => {
        // Disconnect all listeners
        socket.disconnect(); 

        setIsMatchFound(false);
        setIsModalOpen(true);
        setWaitForMatch(false);
    } 
     
    const handleWaitForMatch = () => {
        socket.disconnect(); 
        setWaitForMatch(true);
        setIsModalOpen(false);
        setKey(previousKey => previousKey + 1);  
        window.location.reload(false);
    }

    const handleChangeLevel = () => {
        setIsModalOpen(false);
        navigate("/landing", {state: { user: location.state.user }});
         
        // Disconnect all listeners
        socket.disconnect();  
    }

    const handleProceedWithoutMatch = () => {
        setIsModalOpen(false);
        navigate("/room", {state: { user: location.state.user }});
        
        // Disconnect all listeners
        socket.disconnect(); 
    }

    return (
        <div> 
            <NavigationBar isAuthenticated={true} user={location.state.user}/> 
            <Box display={"flex"} justifyContent={"center"} style={{marginTop: "8%"}}>
                <CountdownCircleTimer
                    key={key}
                    isPlaying
                    duration={30}
                    colors={"#1B7CED"} 
                    size={300}
                    strokeWidth={25}
                    onComplete={handleNoMatchFound}
                    >
                        {renderTime}
                </CountdownCircleTimer>
            </Box> 
            <Box display={"flex"} justifyContent={"center"} style={{marginTop: "2%"}} > 
                <h2>
                    Finding a match...
                </h2>
            </Box>

            {/* Match Failure */}
            <Modal 
                open={isModalOpen}   
                aria-labelledby="modal-modal-title" 
            >
                <Box sx={modalStyle}>
                    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-between"}> 
                        <Typography id="modal-modal-title" variant="h5" component="h2">
                            No match found!
                        </Typography> 
                    </Box> 
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Unfortunately, we could not find you a match.
                    </Typography> 
                    <Box display={"flex"} flexDirection={"column"} style={{ paddingTop: "5%"}}> 
                        <div style={{ marginBottom:"2%" }}>
                            <Button 
                                style={buttonStyle} 
                                variant={"outlined"} 
                                onClick={handleWaitForMatch}
                            >
                                Wait for another 30 seconds
                            </Button>
                        </div> 
                        <div style={{ marginBottom:"2%" }}> 
                            <Button 
                                style={buttonStyle} 
                                variant={"outlined"}
                                onClick={handleChangeLevel}
                            >
                                Select another difficulty level
                            </Button>
                        </div>
                        <div style={{ marginBottom:"2%" }}> 
                            <Button 
                                style={buttonStyle} 
                                variant={"outlined"}
                                onClick={handleProceedWithoutMatch}
                            >
                                Proceed without a match
                            </Button>
                        </div>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default MatchingPage;