import { ormCreateUser as _createUser } from '../model/user-orm.js'
import { ormGetUser as _getUser } from '../model/user-orm.js'
import { ormDeleteUser as _deleteUser } from '../model/user-orm.js'
import { ormUpdatePassword as _updatePassword } from '../model/user-orm.js'
import { generateRefreshToken, generateAccessToken } from './user-token-handler.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const jwtAccessSecretKey = "grp27access"

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const existing_user = await _getUser(username)
            if (existing_user !== null) {
                return res.status(400).json({message: 'Could not create a new user, already exists!', success:false});
            }
            const resp = await _createUser(username, password);
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new user!', success:false});
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({username: username, message: `Created new user ${username} successfully!`, success:true});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!', success:false});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!', success:false})
    }
}

export async function loginUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const existing_user = await _getUser(username)
            if (existing_user === null) {
                return res.status(404).json({message: 'User does not exist!', success:false});
            } else {
                const passwordValid = await bcrypt.compare(password, existing_user.password);
                if (passwordValid) {
                    // generate and return JWT token
                    const accessToken = generateAccessToken(username)
                    const refreshToken = generateRefreshToken(username)
                    return res.status(200).json({username: username, accessToken: accessToken, refreshToken: refreshToken, success:true})
                } else {
                    return res.status(401).json({message: 'Incorrect password!', success:false});
                }
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!', success:false});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when retrieving user!', success:false})
    }
}

export async function deleteUser(req, res) {
    try {
        const username = req.body.username
        const accessToken = req.body.token
        if (accessToken && username) {
            const decodedPayload = jwt.verify(accessToken, jwtAccessSecretKey)
            const decodedUsername = decodedPayload.username
            if (decodedUsername != username) {
                return res.status(400).json({message: "Username and JWT token do not match.", success:false})
            }
            const deleteUserSuccess = await _deleteUser(decodedUsername)
            if (deleteUserSuccess) {
                return res.status(200).json({username: decodedUsername, message: `Deleted user ${decodedUsername} successfully!`, success:true})
            } else {
                return res.status(500).json({message: "Error deleting user from database", success:false})
            }
        } else {
            return res.status(400).json({message: "'Access token and/or username are missing!", success:false})
        }
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "JWT Token has Expired.", success:false})
        } else {
            return res.status(400).json({message: "Problem verifying JWT token.", success:false})
        }
    }
}

// Specify {"key":"<value>"} in the request body to update the field "key" for the specified user in mongoDB.
export async function updatePassword(req, res) {
    try {
        const username = req.body.username
        const newPassword = req.body.newpassword
        const accessToken = req.body.token
        if (username && accessToken && newPassword) {
            const decodedPayload = jwt.verify(accessToken, jwtAccessSecretKey)
            const updatedUser = await _updatePassword(username, newPassword)
            if (updatedUser === null) {
                return res.status(500).json({message: "Error updating user in database", success:false})
            } else {
                return res.status(200).json({username: updatedUser.username, message: `Updated user ${updatedUser.username} password successfully!`, success:true})
            }
        } else {
            return res.status(400).json({message: "'Access token, username and/or new password are missing!", success:false})
        }
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({message: "JWT Token has Expired.", success:false})
        } else {
            return res.status(400).json({message: "Problem verifying JWT token or updating user details.", success:false})
        }
    }

}