function sendMatch(socket, data) {
  socket.emit('match', data);
}

function sendMatchFail(socket, data) {
  socket.emit('matchFail', data);
} 

function sendMatchSuccess(socket, data) {
  socket.emit('matchSuccess', data);
}

export {
  sendMatch,
  sendMatchFail,
  sendMatchSuccess
}
