import { ormCreateMatch as _createMatch, ormDeleteMatchBySocketId as _deleteMatch, ormDeleteOutdatedMatch as _deleteOutdatedMatch, ormFindMatch as _findMatch }
  from '../model/match-orm.js'
import { sendMatchFail, sendMatchSuccess } from '../services/socket.js'
import { Match } from '../model/repository.js'
import { publishMatch } from '../mq.js';

const WAITING_TIME = 30 * 1000;

const uid = function() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function matchUsers(socket1, socket2, difficulty) {
  const roomId = uid();
  sendMatchSuccess(socket1, { message: 'success', room_id: roomId });
  sendMatchSuccess(socket2, { message: 'success', room_id: roomId });
  console.log("PUBLISHING MATCH >>>>>>>>>>")
  publishMatch({
    "room_id": roomId,
    "difficulty_level": difficulty.toLowerCase(),
    "username1": socket1.decodedToken.username,
    "username2": socket2.decodedToken.username,
    "user_id1": socket1.decodedToken.id,
    "user_id2": socket2.decodedToken.id
  });
}

async function matchTimeOut(before) {
  const resp = await _deleteOutdatedMatch(before);
  if (resp.err) {
    console.log(`Could not remove time out matches; err=${err}`);
  }
}

export function registerHandlers(io, socket) {
  async function findMatch({ difficulty }) {
    try {
      const username = socket.user;
      if (!difficulty) {
        sendMatchFail(socket, { message: 'Difficulty is missing!' });
        return;
      }

      difficulty = difficulty.toUpperCase();
      const difficulties = Match.getAttributes().difficulty.values;
      if (!difficulties.includes(difficulty)) {
        console.log(`Incorrect match request argument format! difficulty=${difficulty}`);
        sendMatchFail(socket, { message: `Incorrect match request argument format! difficulty=${difficulty}` });
        return;
      }

      var resp = await _findMatch(username, difficulty, Date.now() - WAITING_TIME);
      if (resp && resp.err) {
        console.log(`Could not find a match; err=${resp.err}`);
        sendMatchFail(socket, { message: 'Database failure: could not find a match!' });
        return;
      }

      if (!resp) {
        resp = await _createMatch(username, socket.id, difficulty);
        if (resp.err) {
          console.log(`Could not create a new match, err=${resp.err}`);
          sendMatchFail(socket, { message: 'Database failure: could not create a new match!' });
        } else {
          console.log(`Created new match for ${socket.id} successfully!`);
          setTimeout(function() {
            matchTimeOut(Date.now());
            sendMatchFail(socket, { message: 'Could not find a match!' });
            socket.disconnect();
          }, WAITING_TIME);
        }
        return;
      }

      const pendingSocket = io.sockets.sockets.get(resp.socket_id);
      matchUsers(socket, pendingSocket, difficulty);
      socket.disconnect();
      pendingSocket.disconnect();
      await resp.destroy();

    } catch (err) {
      console.log(`Error finding match; err=${err}`);
      sendMatchFail(socket, { message: 'Error when finding match' });
    }
  }

  async function disconnect() {
    try {
      _deleteMatch(socket.id);
    } catch (err) {
      console.log(`Database failure when disconnecting; err=${err}`);
    }
  }

  socket.on('match', findMatch);
  socket.on('disconnect', disconnect);
}
