import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { jwtDecode } from '../../util/auth';
import { isUnauthorizedError } from '@thream/socketio-jwt/build/UnauthorizedError.js'
import { URL_COMM_SVC, PREFIX_COMM_SVC_CHAT } from "../../configs";
import ChatFooter from "./ChatFooter";
import ChatBody from "./ChatBody";
import { Box } from "@mui/material";

const ChatWindow = ({ chatSocket, room_id, username }) => {
    // assumption is that the room_id found in location.state.room_id(probably provided by Matching svc) will availiable to 2 users only.
    chatSocket.on("connect_error", (err) => {
        if (isUnauthorizedError(err)) {
            console.log('User token has expired')
        }
        console.log(`connect_error due to ${err.message}`);
    });

    return ( 
        <Box display={"flex"} flexDirection={"column"} style={{ marginBottom: "3%" }}>
            <ChatBody chatSocket={chatSocket} username={username} room_id={room_id}/>
            <ChatFooter chatSocket={chatSocket} username={username} room_id={room_id}/>
        </Box> 
    );
};

export default ChatWindow;