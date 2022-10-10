import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { jwtDecode } from '../../util/auth';
import ChatFooter from "./ChatFooter";
import ChatBody from "./ChatBody";

const ChatWindow = () => {
    // assumption is that the room_id found in location.state.room_id(probably provided by Matching svc) will availiable to 2 users only.
    const location = useLocation(); // Location contains username, selected difficulty level and room_id
    const [cookies] = useCookies();
    const username = jwtDecode(cookies['refresh_token']).username;
    const room_id = location.state.room_id;

    // const chatSocket = io.connect('http://localhost:8004/api/comm/chat')
    const chatSocket = io('http://localhost:8004', { 
        transports: ['websocket'],
        path: "/api/comm/chat"
    });
    chatSocket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

    useEffect(() => {
        // Emit join room event here
        chatSocket.emit("join room", { 
            room_id: room_id,
            username: username, 
        });

        chatSocket.on('user leave', () => {
            console.log("Other user has left")
        })

        return () => { // component will unmount equivalent
            chatSocket.emit('leave room', { room_id: room_id, username: username });
        }
    }, [chatSocket]);

    return (
        <div className="chat">
            <div className="main_chat">
                <ChatBody chatSocket={chatSocket} username={username} room_id={room_id}/>
                <ChatFooter chatSocket={chatSocket} username={username} room_id={room_id}/>
            </div>
        </div>
    );
};

export default ChatWindow;