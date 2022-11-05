import { userBelongsInRoom } from '../services/roomAuthenticator.js';
import { deleteMatch } from '../services/redis.js';

export function registerHandlers(io, socket) {

  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('disconnect', (reason) => {
    console.log('disconnect', reason)
  })

  socket.on('room', async function(data) {
    const room_id = data.room_id;
    const username = data.username;
    const attempt_idx = data.attempt_idx;
    const userAllowedInRoom = await userBelongsInRoom(username, room_id);
    if (userAllowedInRoom) {
      console.log(`a user joined room=${room_id}`)
      socket.join(data.room_id);
    } else {
      socket.emit("join room fail", { message: "Username does not belong in the room", attempt_idx: attempt_idx });
    }
  });

  socket.on('leave room', async function(data) {
    console.log("received leaving")
    const room_id = data.room_id
    socket.broadcast.to(data.room_id).emit('receive leave', data)
    socket.leave(room_id)
    const deleteMatchSuccess = await deleteMatch(room_id);
    if (deleteMatchSuccess == 1) {
      console.log("Successfully deleted match")
    } else if (deleteMatchSuccess > 1) {
      console.log("Deleted more than 1 match")
    } else {
      console.log("Failed to delete match")
    }
  });

  socket.on('coding event', function(data) {
    console.log(`received coding ${data.room_id}`)
    socket.broadcast.to(data.room_id).emit('receive code', { from: socket.id, newCode: data.newCode });
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
