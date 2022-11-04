import redis from "redis";

const NAMESPACE = 'matching-service';
const END_OF_NAMESPACE = 'end';
const DIFFICULTIES = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];
const TIMEOUT = 30;

var redisClient = null;

async function initRedisClient(host, port, password) {
  const redisUrl = 'redis://default:' + password + '@' + host + ':' + port;
  redisClient = redis.createClient({
    url: redisUrl
  })

  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
}

async function findMatches(difficulty) {
  return await redisClient.keys(getPrefix(difficulty) + ':*');
}

async function createMatch(username, userId, socketId, difficulty) {
  const key = getPrefix(difficulty) + ':' + getPostfix(username);
  return await redisClient.set(key, JSON.stringify({
    userId: userId,
    username: username,
    socketId: socketId,
  }), { EX: TIMEOUT })
}

async function getMatch(key) {
  return await redisClient
    .multi()
    .get(key)
    .del(key)
    .exec();
}

async function deleteIfExist(username) {
  for (let i = 0; i < DIFFICULTIES.length; i++) {
    const key = getPrefix(DIFFICULTIES[i]) + ':' + getPostfix(username);
    await redisClient.del(key);
  }
  return true;
}

function getPrefix(difficulty) {
  return NAMESPACE + ':' + difficulty;
}

function getPostfix(username) {
  return username + ':' + END_OF_NAMESPACE;
}

export {
  DIFFICULTIES,
  TIMEOUT,
  initRedisClient,
  findMatches,
  createMatch,
  getMatch,
  deleteIfExist
}
