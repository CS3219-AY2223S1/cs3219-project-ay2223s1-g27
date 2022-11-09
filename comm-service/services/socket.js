export function sendJoinRoomFail(socket, data) {
    socket.emit('joinRoomFail', data);
}