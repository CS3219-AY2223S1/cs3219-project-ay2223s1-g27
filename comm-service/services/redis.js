import redis from "redis";

var redisClient = null;
const match_prefix = "matchdata:"

async function initMatchInfoRedisClient(host, port, password) {
  const redisUrl = 'redis://default:' + password + '@' + host + ':' + port;
  redisClient = redis.createClient({
    url: redisUrl
  })

  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
}

async function getMatch(room_id) {
  return await redisClient.get(appendPrefixToKey(room_id));
}

async function deleteMatch(room_id) {
  return await redisClient.del(appendPrefixToKey(room_id));
}

async function addMatch(room_id, difficulty_level, username1, username2, user_id1, user_id2) {
  return await redisClient.set(appendPrefixToKey(room_id), JSON.stringify({
    room_id: room_id,
    difficulty_level: difficulty_level,
    username1: username1,
    username2: username2,
    user_id1: user_id1,
    user_id2: user_id2,
  }))
}

function appendPrefixToKey(key) {
  return match_prefix + key;
}

export {
  initMatchInfoRedisClient,
  getMatch,
  deleteMatch,
  addMatch
}
