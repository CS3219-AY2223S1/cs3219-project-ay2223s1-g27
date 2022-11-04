function sendMatch(io, socket, data) {
  io.to(socket).emit('match', data);
}

function sendMatchFail(io, socket, data) {
  io.to(socket).emit('matchFail', data);
}

function sendMatchSuccess(io, socket, data) {
  io.to(socket).emit('matchSuccess', data);
}

export {
  sendMatch,
  sendMatchFail,
  sendMatchSuccess
}
