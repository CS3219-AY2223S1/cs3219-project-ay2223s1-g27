import { ormCreateMatch as _createMatch } from '../model/match-orm.js'
import { sendMatch, sendMatchFail, sendMatchSuccess } from '../services/index.js'

const matchFail = 'matchFail'

export function registerHandlers (io, socket) {  
  async function createMatch(username, difficulty) {
    try {
      if (username && difficulty) {
        const resp = await _createMatch(username, difficulty);
        if (resp.err) {
          console.log(`Could not create a new match, err: ${err}`);
          sendMatchFail(socket, {message: 'Could not create a new match!'});
        } else {
          console.log(`Created new match for ${username} successfully!`);
          sendMatch(socket, {message: `Created new match for ${username} successfully!`});
        }
      } else {
        console.log(`Username and/or Difficulty are missing!`);
        sendMatchFail({message: 'Username and/or Difficulty are missing!'});
      }
    } catch (err) {
      console.log(`Database failure when creating new match, err: ${err}`);
      sendMatchFail(socket, {message: 'Database failure when creating new match!'});
    }
  }

  socket.on('match', createMatch);
}
