import { sendJoinRoomFail } from '../services/socket.js'
import { userBelongsInRoom } from '../services/roomAuthenticator.js';
import { setInterviewer, getInterviewer, deleteInterviewer } from '../services/redis.js';

const interviewerSwitchEvent = 'interviewer switch event';
const interviewerSwitchRequestEvent = 'request interviewer switch'; 

export function registerChatHandlers(io, clientSocket) {
    clientSocket.on('join room', async function(eventData) {
        if (!eventData.room_id) {
            console.log("Join room event emitted without room_id");
            sendJoinRoomFail(clientSocket, { message: "missing room_id" });
        }
        const room_id = eventData.room_id;
        const username = eventData.username;
        const attempt_idx = eventData.attempt_idx;
        const userAllowedInRoom = await userBelongsInRoom(username, room_id);
        if (userAllowedInRoom) {
            console.log(`User ${username} joined room=${room_id}`);
            clientSocket.join(room_id);
            const interviewer = await getInterviewer(room_id);
            if (!interviewer) {
                const setInterviewerResult = await setInterviewer(room_id, username);
                console.log("Set interviewer result: ", setInterviewerResult)
            } else {
                // second client socket fires "join room" event
                // fire event to all clients in a room TODO
                console.log(`Fired to room ${room_id}`)
                io.to(room_id).emit(interviewerSwitchEvent, {
                    room_id: room_id,
                    interviewer: interviewer,
                });
            }
        } else {
            clientSocket.emit("join room fail", { message: "Username does not belong in the room", attempt_idx: attempt_idx });
        }        
    });

    clientSocket.on('message', function(data) {
        io.to(data.room_id).emit('message response', data)
    });

    // assumes only the interviewee can request to become the interviewer 
    clientSocket.on(interviewerSwitchRequestEvent, async function(data) {
        const room_id = data.room_id;
        const newInterviewer = data.username; 
        const setInterviewerResult = await setInterviewer(room_id, newInterviewer);
        console.log("Set new interviewer result: ", setInterviewerResult)
        // fire event to all clients in a room TODO
        io.to(room_id).emit(interviewerSwitchEvent, {
            room_id: room_id,
            interviewer: newInterviewer 
        });
    })
 

    clientSocket.on('disconnect', (reason) => {
        console.log('The user has disconnected from chat due to ' + reason);
    });

    clientSocket.on('leave room', async function(data) {
        console.log(`A user ${data.username} has left the chat room`);
        const room_id = data.room_id;
        io.to(room_id).emit('user leave', data)
        const delInterviewerResult = await deleteInterviewer(room_id);
        console.log("Delete interviewer result: ", delInterviewerResult)
    });

}