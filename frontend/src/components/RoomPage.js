import React, { useEffect, useState } from "react";
import {
  Box,
  Button, 
  Popover,
  Fab,
  Typography,
  Tooltip
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useCookies } from 'react-cookie';
import CodeEditorLanding from "./editor/CodeEditorLanding";
import NavigationBar from "./NavigationBar";
import ChatWindow from "./chat/ChatWindow";
import { PREFIX_COLLAB_SVC, URL_COLLAB_SVC, URL_COMM_SVC, PREFIX_COMM_SVC_CHAT } from "../configs";
import { INTERVIEWER_SWITCH_EVENT } from "../constants";
import { jwtDecode } from "../util/auth";
import LogoutIcon from '@mui/icons-material/Logout'; 
import Draggable from 'react-draggable';

// import ResizePanel from "react-resize-panel";
import ChatIcon from '@mui/icons-material/Chat';
import { isUnauthorizedError } from '@thream/socketio-jwt/build/UnauthorizedError.js'
import { URL_USER_SVC_MESSAGE } from "../configs";
import axiosApiInstance, { refreshAccessToken } from "../axiosApiInstance";

function RoomPage() {
  const [cookies, setCookies] = useCookies();
  const location = useLocation(); // Location contains username and selected difficulty level
  const navigate = useNavigate();
  // ChatWindow Props
  const [isInterviewer, setIsInterviewer] = useState(); 
  const [messages, setMessages] = useState([]);
  const [socketForChat, setSocketForChat] = useState();
  const [codeEditorSocket, setCodeEditorSocket] = useState();

  const [anchorEl, setAnchorEl] = useState(null);
  // const [paneOpen, setPaneOpen] = useState(false);
  // console.log(location.state.difficultyLevel)

  const room_id = location.state.room_id;
  const username = jwtDecode(cookies['refresh_token']).username;
  const chatWindowOpen = Boolean(anchorEl);

  console.log(location.state.is_live)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }

  // const handleOpen = () => {
  //   setPaneOpen(true);
  // }

  const handleClose = () => {
    setAnchorEl(null);
  }
  useEffect(() => {
    if (!location.state.is_live) return;
    // console.log(location.state.difficultyLevel)

    const codeSocket = io(URL_COLLAB_SVC, {
      transports: ['websocket'],
      path: PREFIX_COLLAB_SVC,
      auth: {
        token: `Bearer ${cookies['access_token']}`
      }
    });

    codeSocket.io.on("reconnection_attempt", () => {
      console.log('reconnection attempt')
    });

    codeSocket.io.on("reconnect", () => {
      console.log('reconnect')
    });

    codeSocket.on('connect', () => {
      codeSocket.emit('room', { room_id: location.state.room_id });
    })

    setCodeEditorSocket(codeSocket);

    return () => { // component will unmount equivalent
      codeSocket.emit('leave room', { room_id: location.state.room_id, username: jwtDecode(cookies['refresh_token']).username });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!location.state.is_live) return;
    
    const chatSocket = io(URL_COMM_SVC, { 
      transports: ['websocket'],
      path: PREFIX_COMM_SVC_CHAT,
      auth: {
          token: `Bearer ${cookies['access_token']}`
      }
    });
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

    chatSocket.on(INTERVIEWER_SWITCH_EVENT, (data) => {
      const interviewer = data.interviewer; 
      console.log("Logging interviewer from ChatBody!")
      console.log(data)
      if (interviewer === username) {
          setIsInterviewer(true); 
      } else {
          setIsInterviewer(false);
      } 
    })
  
    chatSocket.on("connect_error", (err) => {
      if (isUnauthorizedError(err)) {
          console.log('User token has expired')
      }
      console.log(`connect_error due to ${err.message}`);
    });

    setSocketForChat(chatSocket)

    return () => { // component will unmount equivalent
        chatSocket.emit('leave room', { room_id: room_id, username: username });
        chatSocket.off('connect');
        chatSocket.off('user leave');
        chatSocket.off(INTERVIEWER_SWITCH_EVENT);
        chatSocket.off('message response');
        chatSocket.off('connect_error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Necessary useEffect for messages to be updated. using the listener. 
  // Separated from above useEffect to prevent uneccesary re-renders
  useEffect(() => {
    if (socketForChat !== undefined) {
      socketForChat.on('message response', (data) => {
        console.log(data)
        console.log(messages)
        const newMessageObjArr = [...messages, data]
        setMessages(newMessageObjArr)
        if (location.state.is_live) {
          axiosApiInstance.post(URL_USER_SVC_MESSAGE, {room_id: room_id, messages: newMessageObjArr})
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketForChat, messages, location.state.is_live])

  // Attempt history related useEffect
  useEffect(() => {
    console.log(messages)
    if (!location.state.is_live) {
      axiosApiInstance.get(URL_USER_SVC_MESSAGE, {params: {room_id: room_id}}).then(x => {
        if (x.data) {
          setMessages(x.data.messages);
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep refreshing token when having sockets
  useEffect(() => {
    refreshAccessToken(setCookies);
    let refreshTokenInterval;
    if (location.state.is_live) refreshTokenInterval = setInterval(() => refreshAccessToken(setCookies), 5 * 60 * 1000); // every 5 min
    return () => {
      if (location.state.is_live) clearInterval(refreshTokenInterval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLeaveSession = () => {
    navigate("/landing", { state: { user: location.state.user } });
  }
  return (
    <>
      <NavigationBar isAuthenticated={true} user={location.state.user} />
      <div style={{overflowX: 'hidden'}}> 
        <Typography sx={{ marginLeft: "3%", marginTop: "1%", marginBottom: "-3%" }} variant={"h3"} marginBottom={"2rem"}>Coding Room</Typography>
        {/* Uncomment this for popover chat left: 1600, top: 110 */}
        {/* <Box display="flex" flexDirection="row" justifyContent={'flex-end'} sx={{marginRight: '3%'}}> */} 
        <Draggable bounds={{right: 1600}}>
          <div>
            <Tooltip title="Open chatbox!" placement="bottom"> 
              <Fab style={{ backgroundColor: '#1976d2', color: "#fff" }} onClick={(e) => handleClick(e)}>
                  <ChatIcon/>
              </Fab>
            </Tooltip>
            <Popover
              id={'simple-popover'}
              open={chatWindowOpen}
              anchorEl={anchorEl}
              onClose={handleClose}
              PaperProps={{
                style: { width: '27%' },
              }}
              anchorOrigin={{
                vertical:'bottom',
                horizontal:'left'
              }}
            >
              <ChatWindow chatSocket={socketForChat} room_id={room_id} username={username} isInterviewer={isInterviewer} messages={messages}/> 
            </Popover>
          </div> 
        </Draggable> 
        {/* </Box>  */}
        <Box display={"flex"} flexDirection={"column"} style={{ marginTop: '3%', marginLeft: "3%", marginRight: "3%" }}>  
          <CodeEditorLanding socket={codeEditorSocket} isInterviewer={isInterviewer} room_id={room_id} username={username} cache={location.state.cache} is_live={location.state.is_live} />
          <div style={{ marginTop: '1%' }}></div>
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
