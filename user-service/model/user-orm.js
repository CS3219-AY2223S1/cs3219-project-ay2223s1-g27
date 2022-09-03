import { createUser, getUser } from './repository.js';
import bcrypt from 'bcrypt'

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    try {
        // Hash password using bcrypt module
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await createUser({username: username, password: hashedPassword});
        newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormGetUser(username) {
    let user = await getUser(username)
    return user
}

