import { ormCreateUser as _createUser } from '../model/user-orm.js'
import { ormGetUser as _getUser } from '../model/user-orm.js'
import { generateRefreshToken, generateAccessToken } from './user-token-handler.js'
import bcrypt from 'bcrypt'

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

        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when retrieving user!', success:false})
    }
}