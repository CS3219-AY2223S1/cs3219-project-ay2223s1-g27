import { sendJoinRoomFail } from '../services/socket.js'


var roomInterviewers = {};
const interviewer_switch_event = 'interviewer switch event';
const interviewer_switch_request_event = 'request interviewer switch';

export function registerChatHandlers(io, clientSocket) {
    clientSocket.on('join room', eventData => {
        if (!eventData.room_id) {
            console.log("Join room event emitted without room_id");
            sendJoinRoomFail(clientSocket, { message: "missing room_id" });
        }
        const room_id = eventData.room_id;
        const username = eventData.username;
        console.log(eventData)
        console.log(`User ${username} joined room=${room_id}`)
        clientSocket.join(room_id);
        if (!room_id in roomInterviewers) {
            roomInterviewers[room_id] = username;
            // fire event to all clients in a room TODO
            io.to(room_id).emit(interviewer_switch_event, {
                room_id: room_id,
                interviewer: username,
            });
        }
    });

    // clientSocket.on('message', function(data) {
    //     console.log(`Received message ${data.text}`);
    //     clientSocket.broadcast.to(data.room_id).emit('receive message', data);
    // });
    clientSocket.on('message', data => {
        console.log(data)
        io.to(data.room_id).emit('message response', data)
    });

    // assumes only the interviewee can request to become the interviewer
    clientSocket.on(interviewer_switch_request_event, data => {
        const room_id = data.room_id;
        const newInterviewer = data.username;
        roomInterviewers[room_id] = newInterviewer;
        // fire event to all clients in a room TODO
        io.to(room_id).emit(interviewer_switch_event, {
            room_id: room_id,
            interviewer: newInterviewer,
        });
    })

    clientSocket.on('disconnect', () => {
        console.log('The user has disconnected from chat');
    });

    clientSocket.on('leave room', data => {
        console.log(`A user ${data.username} has left the chat room`);
        const room_id = data.room_id;
        io.to(room_id).emit('user leave', data)
        if (room_id in roomInterviewers) {
            delete roomInterviewers[room_id]
        }
    });

}