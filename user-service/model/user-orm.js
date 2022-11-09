import { createUser, getUser, deleteUser, updatePassword } from './repository.js';
import bcrypt, { hash } from 'bcrypt'

//need to separate orm functions from repository to decouple business logic from persistence

async function hashPassword(password) {
    // Hash password using bcrypt module
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}

export async function ormCreateUser(username, password, email) {
    try {
        const hashedPassword = await hashPassword(password)
        const newUser = await createUser({username: username, password: hashedPassword, email: email});
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

export async function ormDeleteUser(username, password) {
    let deleteSuccess = await deleteUser(username)
    return deleteSuccess
}

export async function ormUpdatePassword(username, newPassword) {
    const hashedNewPassword = await hashPassword(newPassword)
    let updatedUser = await updatePassword(username, hashedNewPassword)
    return updatedUser
}