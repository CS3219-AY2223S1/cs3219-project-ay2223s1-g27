import React from "react";
import { isUnauthorizedError } from '@thream/socketio-jwt/build/UnauthorizedError.js'
import ChatFooter from "./ChatFooter";
import ChatBody from "./ChatBody";
import { Box } from "@mui/material";

const ChatWindow = ({ chatSocket, room_id, username, isInterviewer, messages }) => {
    // assumption is that the room_id found in location.state.room_id(probably provided by Matching svc) will availiable to 2 users only.

    return (
        <Box display={"flex"} flexDirection={"column"} style={{ marginBottom: "3%" }}>
            <ChatBody chatSocket={chatSocket} username={username} room_id={room_id} isInterviewer={isInterviewer} messages={messages}/>
            <ChatFooter chatSocket={chatSocket} username={username} room_id={room_id}/>
        </Box> 
    );
};

export default ChatWindow;