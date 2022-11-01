import jwt from "jsonwebtoken"
import redis from "redis";
import { getJWTTokenFromAuthHeader } from './user-controller.js'

const jwtAccessSecretKey = process.env.JWT_ACCESS_SECRET
const jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET

const ACCESS_TOKEN_EXPIRE_TIME = 900000
const REFRESH_TOKEN_EXPIRE_TIME = 1200000

const redisUrl = 'redis://default:' + process.env.REDIS_PASSWORD + '@' + process.env.REDIS_HOST + ':' + process.env.REDIS_PORT

const redisClient = redis.createClient({
  url: redisUrl
});

console.log(process.env.REDIS_HOST)
console.log(process.env.REDIS_PORT)
console.log(process.env.REDIS_PASSWORD)
redisClient.on('error', (err) => console.log('Redis Client Error', err));
await redisClient.connect();

const allRedisKeys = await redisClient.keys("*")
console.log("All existing refresh tokens")
console.log(allRedisKeys)

// Cleanup happens every 20 minutes
var refreshTokensCleanupTimer = setInterval(cleanupRefreshTokens, 1200000)

function convertMongooseObjectToString(obj) {
  return obj.toString();
}

// requestbody is of the format: {"username":"<username>", "password":"<password>"}
export function generateAccessToken(username, id) {
  try {
    // Entire requestbody(includes password) is passed  to jwt.sign to add more 
    // variability to jwt token when user changes passwords
    const accessToken = jwt.sign({ username: username, id: id }, jwtAccessSecretKey, { expiresIn: "15m" })
    return accessToken
  } catch (err) {
    console.log(err)
  }
}

export async function generateRefreshToken(username, id) {
  try {
    const refreshToken = jwt.sign({ username: username, id: id }, jwtRefreshSecretKey, { expiresIn: "24h" })
    const idStr = convertMongooseObjectToString(id)
    console.log(idStr)
    const setResult = await redisClient.set(idStr, refreshToken)
    console.log("setResult")
    console.log(setResult)
    return refreshToken
  } catch (err) {
    console.log(err)
  }
}

export function validateAccessToken(req, res) {
  const username = req.body.username
  const token = getJWTTokenFromAuthHeader(req.headers.authorization)
  if (token == undefined) {
    // bad request syntax
    return res.status(400).json({ message: "Incorrect request body format, please specify a key value pair 'token':'<token>'", success: false })
  }
  try {
    const decodedPayload = jwt.verify(token, jwtAccessSecretKey)
    const decodedUsername = decodedPayload.username
    if (decodedUsername != username) {
      return res.status(400).json({ message: "Username and JWT token do not match.", success: false })
    }
    return res.status(200).json({ username: decodedUsername, success: true })
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "JWT Token has Expired.", success: false })
    } else {
      return res.status(400).json({ message: "Problem verifying JWT token, make sure you passed the access token.", success: false })
    }
  }
}

export async function renewAccessAndRefreshTokens(req, res) {
  const username = req.body.username
  const refreshToken = getJWTTokenFromAuthHeader(req.headers.authorization)
  if (refreshToken == undefined) {
    // bad request syntax
    return res.status(400).json({ message: "Incorrect request body format, please specify a key value pair 'token':'<token>'", success: false })
  }
  // verify that refreshToken is valid
  try {
    const decodedPayload = jwt.verify(refreshToken, jwtRefreshSecretKey)
    const decodedUsername = decodedPayload.username
    const decodedId = decodedPayload.id
    const decodedIdStr = convertMongooseObjectToString(decodedId)
    if (decodedUsername != username) {
      return res.status(400).json({ message: "Username and JWT token do not match.", success: false })
    }
    const existingRefreshToken = await redisClient.get(decodedIdStr)
    if (!existingRefreshToken) {
      return res.status(401).json({ message: "User has not logged in yet", success: false })
    } else {
      if (existingRefreshToken !== refreshToken) {
        return res.status(401).json({ message: "JWT refresh Token invalid.", success: false })
      }
    }
    const newAccessToken = generateAccessToken(decodedPayload.username, decodedPayload.id)
    const newRefreshToken = await generateRefreshToken(decodedPayload.username, decodedPayload.id)
    return res.status(200).json({ username: decodedPayload.username, accessToken: newAccessToken, refreshToken: newRefreshToken, success: true })
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "JWT refresh Token has Expired.", success: false })
    } else {
      console.log(err)
      return res.status(400).json({ message: "Problem verifying JWT refresh token, , make sure you passed the refresh token.", success: false })
    }
  }
}

export async function invalidateRefreshToken(req, res) {
  const username = req.body.username
  const refreshToken = req.body.refresh_token
  if (refreshToken == undefined) {
    // bad request syntax
    return res.status(400).json({ message: "Incorrect request body format, please specify a key value pair 'token':'<token>'", success: false })
  }
  try {
    const decodedPayload = jwt.verify(refreshToken, jwtRefreshSecretKey)
    const decodedUsername = decodedPayload.username
    const decodedId = decodedPayload.id
    const decodedIdStr = convertMongooseObjectToString(decodedId)
    if (decodedUsername != username) {
      return res.status(400).json({ message: "Username and JWT token do not match.", success: false })
    }
    const existingRefreshToken = await redisClient.get(decodedIdStr)
    if (!existingRefreshToken) {
      return res.status(401).json({ message: "User has not logged in yet", success: false })
    } else {
      if (existingRefreshToken !== refreshToken) {
        return res.status(401).json({ message: "JWT refresh Token invalid.", success: false })
      }
    }
    const removeRefreshToken = await redisClient.del(decodedIdStr)
    console.log(removeRefreshToken)
    if (removeRefreshToken == 1) {
      console.log("Successfully deleted refresh token")
    } else if (removeRefreshToken > 1) {
      console.log("Deleted more than 1 refresh tokens")
    } else {
      console.log("Failed to delete refresh token")
    }
    return res.status(200).json({ username: decodedPayload.username, message: "Successfully logged out", success: true })
  } catch (err) {
    return res.status(400).json({ message: "Problem invalidating refresh token, make sure you passed the refresh token.", success: false })
  }
}

async function cleanupRefreshTokens() {
  const allRedisKeys = await redisClient.keys("*")
  console.log(allRedisKeys)
  for (var i = 0; i < allRedisKeys.length; i++) {
    const key = allRedisKeys[i]
    const refreshToken = await redisClient.get(key)
    try {
      jwt.verify(refreshToken, jwtRefreshSecretKey)
    } catch (err) {
      const deleteStatus = await redisClient.del(key)
      if (deleteStatus == 0) {
        console.log("Successfully deleted refresh token")
      } else {
        console.log("Failed to delete refresh token")
      }
    }
  }
}
