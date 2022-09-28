import { createPwdResetRequest, getPwdResetRequest } from "./repository.js";

export async function ormCreatePwdResetRequest(params) {
    try {
        let pwdResetRequest = await createPwdResetRequest(params)
        pwdResetRequest.save()
        return pwdResetRequest
    } catch (err) {
        console.log('ERROR: Could not create new password reset request');
        return { err };
    }
}

export async function ormGetPwdResetRequest(documentId) {
    let pwdResetRequest = await getPwdResetRequest(documentId)
    return pwdResetRequest
}