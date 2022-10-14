var map = {};

export function registerHandlers(io, socket) {

  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('disconnect', (reason) => {
    console.log('disconnect', reason)
  })

  socket.on('room', function(data) {
    console.log(`a user joined room=${data.room_id}`)
    socket.join(data.room_id);
    if (io.sockets.adapter.rooms.get(data.room_id).size != 1) {
      return
    }
    setInterval(() => {
      if (map[data.room_id])
        socket.broadcast.to(data.room_id).emit('receive code', map[data.room_id]);
    }, 1000)
  });

  socket.on('leave room', (data) => {
    console.log("received leaving")
    socket.broadcast.to(data.room_id).emit('receive leave', data)
    socket.leave(data.room_id)
  });

  socket.on('coding event', function(data) {
    console.log(`received coding ${data.room_id}`)
    map[data.room_id] = data
  });

  socket.on('language event', function(data) {
    console.log(`received language ${data.room_id}`)
    console.log(`langauge id is ${data.language_id}`)
    socket.broadcast.to(data.room_id).emit('receive language', data)
  });

  socket.on('question event', function(data) {
    console.log(`received question ${data.room_id}`)
    socket.broadcast.to(data.room_id).emit('receive question', data)
  });

  socket.on('output event', function(data) {
    console.log(`received output ${data.room_id}`)
    socket.broadcast.to(data.room_id).emit('receive output', data)
  });
}
