import redis from "redis";

var redisClient = null;
const match_prefix = "matchdata:"
const interviewer_prefix = "interviewer:"
// 4 hour timeout
const entry_timeout = 14400;

async function initMatchInfoRedisClient(host, port, password) {
  const redisUrl = 'redis://default:' + password + '@' + host + ':' + port;
  redisClient = redis.createClient({
    url: redisUrl
  })

  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
}

async function getMatch(room_id) {
  return await redisClient.get(appendRoomPrefixToKey(room_id));
}

async function getInterviewer(room_id) {
  return await redisClient.get(appendInterviewerPrefixToKey(room_id));
}

async function deleteMatch(room_id) {
  return await redisClient.del(appendRoomPrefixToKey(room_id));
}

async function deleteInterviewer(room_id) {
  return await redisClient.del(appendInterviewerPrefixToKey(room_id));
}

async function addMatch(room_id, difficulty_level, username1, username2, user_id1, user_id2) {
  return await redisClient.set(appendRoomPrefixToKey(room_id), JSON.stringify({
    room_id: room_id,
    difficulty_level: difficulty_level,
    username1: username1,
    username2: username2,
    user_id1: user_id1,
    user_id2: user_id2,
  }), { EX: entry_timeout })
}

async function setInterviewer(room_id, interviewer_username) {
  return await redisClient.set(appendInterviewerPrefixToKey(room_id), interviewer_username)
}

function appendRoomPrefixToKey(key) {
  return match_prefix + key;
}

function appendInterviewerPrefixToKey(key) {
  return interviewer_prefix + key;
}

export {
  initMatchInfoRedisClient,
  getMatch,
  deleteMatch,
  addMatch,
  getInterviewer,
  deleteInterviewer,
  setInterviewer
}
