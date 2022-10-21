import React, { useEffect } from "react";
import {
  Box,
  Button,
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

function RoomPage() {
  const [cookies] = useCookies();
  const location = useLocation(); // Location contains username and selected difficulty level
  const navigate = useNavigate();
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

  return (
    <>
      <NavigationBar isAuthenticated={true} user={location.state.user} />
      <div>
        <Typography sx={{ marginLeft: "3%", marginTop: "1%", marginBottom: "-2%" }} variant={"h3"} marginBottom={"2rem"}>Coding Room</Typography>
        <Box display={"flex"} flexDirection={"column"} style={{ marginTop: "3%", marginLeft: "3%", marginRight: "3%" }}>
          <CodeEditorLanding socket={codeEditorSocket} chatSocket={chatSocket} room_id={room_id} username={username} />
          <div style={{ marginTop: '1%' }}></div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '5px', color: '#0f172a' }}> Messenger </h1>
          <ChatWindow chatSocket={chatSocket} room_id={room_id} username={username} />
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
