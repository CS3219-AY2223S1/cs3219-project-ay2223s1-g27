import React, { useEffect } from "react";
import {
  Box,
  Button, 
  // Popover,
  // Fab,
  Typography
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useCookies } from 'react-cookie';
import CodeEditorLanding from "./editor/CodeEditorLanding";
import NavigationBar from "./NavigationBar";
import ChatWindow from "./chat/ChatWindow";
import { PREFIX_COLLAB_SVC, URL_COLLAB_SVC, URL_COMM_SVC, PREFIX_COMM_SVC_CHAT } from "../configs";
import { jwtDecode } from "../util/auth";
import LogoutIcon from '@mui/icons-material/Logout'; 
 
// import ResizePanel from "react-resize-panel";
// import ChatIcon from '@mui/icons-material/Chat';

function RoomPage() {
  const [cookies] = useCookies();
  const location = useLocation(); // Location contains username and selected difficulty level
  const navigate = useNavigate();
  // const [anchorEl, setAnchorEl] = useState(null);
  // const [paneOpen, setPaneOpen] = useState(false);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // }

  // const handleOpen = () => {
  //   setPaneOpen(true);
  // }

  // const handleClose = () => {
  //   setAnchorEl(null);
  // }

  console.log(location.state.difficultyLevel)
  const room_id = location.state.room_id;
  const username = jwtDecode(cookies['refresh_token']).username;

  const codeEditorSocket = io(URL_COLLAB_SVC, {
    transports: ['websocket'],
    path: PREFIX_COLLAB_SVC,
    auth: {
      token: `Bearer ${cookies['access_token']}`
    }
  });

  const chatSocket = io(URL_COMM_SVC, { 
    transports: ['websocket'],
    path: PREFIX_COMM_SVC_CHAT,
    auth: {
        token: `Bearer ${cookies['access_token']}`
    }
  });

  useEffect(() => {
    console.log(location.state.difficultyLevel)
    codeEditorSocket.io.on("reconnection_attempt", () => {
      console.log('reconnection attempt')
    });

    codeEditorSocket.io.on("reconnect", () => {
      console.log('reconnect')
    });

    codeEditorSocket.on('connect', () => {
      codeEditorSocket.emit('room', { room_id: location.state.room_id });
    })

    return () => { // component will unmount equivalent
      codeEditorSocket.emit('leave room', { room_id: location.state.room_id, username: jwtDecode(cookies['refresh_token']).username });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Emit join room event here
    chatSocket.on('connect', () => {
      chatSocket.emit("join room", { 
        room_id: room_id,
        username: username, 
      });
    })
    
    chatSocket.on('user leave', () => {
        console.log("Other user has left")
    })

    return () => { // component will unmount equivalent
        chatSocket.emit('leave room', { room_id: room_id, username: username });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLeaveSession = () => {
    navigate("/landing", { state: { user: location.state.user } });
  }
  // const open = Boolean(anchorEl);
  // const id = open ? 'simple-popover' : undefined;
  return (
    <>
      <NavigationBar isAuthenticated={true} user={location.state.user} />
      <div> 
        <Typography sx={{ marginLeft: "3%", marginTop: "1%", marginBottom: "-2%" }} variant={"h3"} marginBottom={"2rem"}>Coding Room</Typography>
        {/* Uncomment this for popover chat */}
        {/* <Fab style={{ left: 1800}} onClick={handleClick}>
          <ChatIcon/>
        </Fab>          
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          PaperProps={{
            style: { width: '50%' },
          }}
          anchorOrigin={{
            vertical:'bottom',
            horizontal:'left'
          }}
        >
          <ChatWindow chatSocket={chatSocket} room_id={room_id} username={username} /> 
        </Popover> */}

        {/* <Fab style={{ left: 1800}} onClick={handleOpen}>
          <ChatIcon/>
        </Fab> 
        <SlidingPane
          isOpen={paneOpen}
          title="Messenger"
          onRequestClose={() => setPaneOpen(false)}
        > 
          <ChatWindow chatSocket={chatSocket} room_id={room_id} username={username} />
        </SlidingPane> */}
        <Box display={"flex"} flexDirection={"column"} style={{ marginTop: '3%', marginLeft: "3%", marginRight: "3%" }}>  
          <CodeEditorLanding socket={codeEditorSocket} chatSocket={chatSocket} room_id={room_id} username={username} cache={location.state.cache} is_live={location.state.is_live} />
          <div style={{ marginTop: '1%' }}></div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '5px', color: '#0f172a' }}> Messenger </h1>
          <ChatWindow chatSocket={chatSocket} room_id={room_id} username={username} is_live={location.state.is_live} />
        </Box>  
        <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"} sx={{ marginRight: "3%", marginBottom: "10px" }}>
          <Button
            variant="contained"
            style={{ textTransform: "none", background: "#c61a09", fontSize: "15px", fontWeight: "bold", borderRadius: "7px" }}
            endIcon={<LogoutIcon />}
            onClick={handleLeaveSession}>
            End Session
          </Button>
        </Box>
      </div>
    </>
  )
}

export default RoomPage;
