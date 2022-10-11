import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { jwtDecode } from '../../util/auth';
import { isUnauthorizedError } from '@thream/socketio-jwt/build/UnauthorizedError.js'
import { URL_COMM_SVC, PREFIX_COMM_SVC_CHAT } from "../../configs";
import ChatFooter from "./ChatFooter";
import ChatBody from "./ChatBody";

const ChatWindow = () => {
    // assumption is that the room_id found in location.state.room_id(probably provided by Matching svc) will availiable to 2 users only.
    const location = useLocation(); // Location contains username, selected difficulty level and room_id
    const [cookies] = useCookies();
    const username = jwtDecode(cookies['refresh_token']).username;
    const room_id = location.state.room_id;

    const chatSocket = io(URL_COMM_SVC, { 
        transports: ['websocket'],
        path: PREFIX_COMM_SVC_CHAT,
        auth: {
            token: `Bearer ${cookies['access_token']}`
        }
    });
    chatSocket.on("connect_error", (err) => {
        if (isUnauthorizedError(err)) {
            console.log('User token has expired')
        }
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
    }, [chatSocket, room_id, username]);

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