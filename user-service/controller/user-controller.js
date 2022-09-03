import { ormCreateUser as _createUser } from '../model/user-orm.js'
import { ormGetUser as _getUser } from '../model/user-orm.js'
import { generateRefreshToken, generateAccessToken } from './user-token-handler.js'
import bcrypt from 'bcrypt'

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const existing_user = await _getUser(username)
            console.log(existing_user)
            if (existing_user !== null) {
                return res.status(400).json({message: 'Could not create a new user, already exists!'});
            }
            const resp = await _createUser(username, password);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new user!'});
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({message: `Created new user ${username} successfully!`, success:true});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
}

export async function loginUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const existing_user = await _getUser(username)
            if (existing_user === null) {
                return res.status(404).json({message: 'User does not exist!'});
            } else {
                const passwordValid = await bcrypt.compare(password, existing_user.password);
                console.log(passwordValid)
                if (passwordValid) {
                    // generate and return JWT token
                    const accessToken = generateAccessToken(username)
                    const refreshToken = generateRefreshToken(username)
                    console.log(accessToken)
                    console.log(refreshToken)
                    return res.status(200).json({accessToken: accessToken, refreshToken: refreshToken, success:true})
                } else {
                    return res.status(401).json({message: 'Incorrect password!', success:false});
                }
            }

        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when retrieving user!'})
    }
}