import { DIFFICULTIES, TIMEOUT, findMatches, createMatch, getMatch, deleteIfExist } from '../services/redis.js'
import { sendMatchFail, sendMatchSuccess } from '../services/socket.js'
import { publishMatch } from '../mq.js';

const WAITING_TIME = TIMEOUT * 1000;

const uid = function() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function matchUsers(io, socket1, match, difficulty) {
  const roomId = uid();
  sendMatchSuccess(io, socket1.id, { message: 'success', room_id: roomId });
  sendMatchSuccess(io, match.socketId, { message: 'success', room_id: roomId });
  console.log("PUBLISHING MATCH >>>>>>>>>>")
  publishMatch({
    "room_id": roomId,
    "difficulty_level": difficulty.toLowerCase(),
    "username1": socket1.decodedToken.username,
    "username2": match.username,
    "user_id1": socket1.decodedToken.id,
    "user_id2": match.userId
  });
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
      if (!DIFFICULTIES.includes(difficulty)) {
        console.log(`Incorrect match request argument format! difficulty=${difficulty}`);
        sendMatchFail(socket, { message: `Incorrect match request argument format! difficulty=${difficulty}` });
        return;
      }

      await deleteIfExist(username);
      const keys = await findMatches(difficulty);

      if (keys.length === 0) {
        const resp = await createMatch(username, socket.decodedToken.id, socket.id, difficulty);
        if (!resp) {
          console.log(`create match failed`);
          return;
        }
        setTimeout(function() {
          sendMatchFail(socket, { message: 'Could not find a match!' });
          socket.disconnect();
        }, WAITING_TIME);
        return;
      }

      let [match, success] = await getMatch(keys[0]);
      if (!success) {
        findMatch({ difficulty: difficulty });
        return;
      }
      match = JSON.parse(match)
      matchUsers(io, socket, match, difficulty);
      socket.disconnect();
      pendingSocket.disconnect();
    } catch (err) {
      console.log(`Error finding match; err=${err}`);
      sendMatchFail(socket, { message: 'Error when finding match' });
    }
  }

  async function disconnect() {
    await deleteIfExist(socket.user);
  }

  socket.on('match', findMatch);
  socket.on('disconnect', disconnect);
}
