import jwt from "jsonwebtoken"

// bad practice but for the initial phases we shall leave the jwt secret key as a variable here
// these will be ported to environment variables when being deployed.
const jwtAccessSecretKey = "grp27access"
const jwtRefreshSecretKey = "grp27refresh"

let refreshTokens = []
// Cleanup happens every 20 minutes
var refreshTokensCleanupTimer = setInterval(cleanupRefreshTokens, 1200000)

// requestbody is of the format: {"username":"<username>", "password":"<password>"}
export function generateAccessToken(username) {
    try {
        // Entire requestbody(includes password) is passed  to jwt.sign to add more 
        // variability to jwt token when user changes passwords
        const accessToken = jwt.sign({username: username}, jwtAccessSecretKey, {expiresIn: "15m"})
        return accessToken
    } catch (err) {
        console.log(err)
    }
}

export function generateRefreshToken(username) {
    try {
        const refreshToken = jwt.sign({username: username}, jwtRefreshSecretKey, {expiresIn: "20m"})
        refreshTokens.push(refreshToken)
        return refreshToken
    } catch (err) {
        console.log(err)
    }
}

export function validateAccessToken(req, res) {
    const token = req.body.token
    if (token == undefined) {
        // bad request syntax
        return res.status(400).json({message: "Incorrect request body format, please specify a key value pair 'token':'<token>'", success:false})
    }
    try {
        const decodedPayload = jwt.verify(token, jwtAccessSecretKey)
        return res.status(200).json({username: decodedPayload.username, success:true})
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "JWT Token has Expired.", success:false})
        } else {
            return res.status(400).json({message: "Problem verifying JWT token.", success:false})
        }
    }
}

export function renewAccessAndRefreshTokens(req, res) {
    const refreshToken = req.body.token
    if (refreshToken == undefined) {
        // bad request syntax
        return res.status(400).json({message: "Incorrect request body format, please specify a key value pair 'token':'<token>'", success:false})
    }
    // verify that refreshToken is valid
    try {
        const decodedPayload = jwt.verify(refreshToken, jwtRefreshSecretKey)
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(401).json({message: "JWT refresh Token invalid.", success:false})
        }
        refreshTokens.filter((token) => token != refreshToken)
        const newAccessToken = generateAccessToken(decodedPayload.username)
        const newRefreshToken = generateRefreshToken(decodedPayload.username)
        return res.status(200).json({username: decodedPayload.username, accessToken: newAccessToken, refreshToken: newRefreshToken, success:true})
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "JWT refresh Token has Expired.", success:false})
        } else {
            return res.status(400).json({message: "Problem verifying JWT refresh token.", success:false})
        }
    }
}

export function invalidateRefreshToken(req, res) {
    const refreshToken = req.body.token
    if (refreshToken == undefined) {
        // bad request syntax
        return res.status(400).json({message: "Incorrect request body format, please specify a key value pair 'token':'<token>'", success:false})
    }
    try {
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(401).json({message: "JWT refresh Token invalid.", success:false})
        }
        refreshTokens.filter((token) => token != refreshToken)
        return res.status(200).json({message: "Successfully logged out", success:true})
    } catch (err) {
        return res.status(400).json({message: "Problem invalidating refresh token.", success:false})
    }
}

function cleanupRefreshTokens() {
    let newRefreshTokens = []
    for (var i = 0; i < refreshTokens.length; i++) {
        const refreshToken = refreshTokens[i]
        try {
            jwt.verify(refreshToken, jwtRefreshSecretKey)
            newRefreshTokens.push(refreshToken)
        } catch (err) {
            continue
        }
    }
    refreshTokens = newRefreshTokens
}