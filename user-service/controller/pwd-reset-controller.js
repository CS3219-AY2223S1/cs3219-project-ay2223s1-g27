import { ormGetUser as _getUser } from '../model/user-orm.js'
import { ormCreatePwdResetRequest as _createPwdResetRequest } from '../model/pwd-reset-orm.js'
import { ormGetPwdResetRequest as _getPwdResetRequest } from '../model/pwd-reset-orm.js'

import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const emailRegex = RegExp("\\S+@\\S+\\.\\S+")

function generateEmailMessage(recipientEmail, username, pwdResetUrl) {
    const body = 'You have requested to reset the password for the PeerPrep account with username: ' + username +'. \n Please click on the following link to do so.';
    const userSvcSenderEmail = process.env.USER_SVC_SENDER_EMAIL
    return {
        to: recipientEmail,
        from: userSvcSenderEmail,
        subject: 'PeerPrep account password reset request',
        html: `<strong>Greetings from Peer Prep Scammers!</strong><body><p>${body}</p></body><body><p>Click to set a new password : <a href="${pwdResetUrl}">Reset password</a></p></body>`,
    };
}

export async function sendPasswordResetEmail(req, res) {
    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    const username = req.body.username
    const email = req.body.email
    if (username && email) {
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: 'Could not reset password, email format invalid. Email has to contain the @ and . character', success:false});
        }
        const existingUser = await _getUser(username)
        var userEmail
        if (existingUser) {
            userEmail = existingUser.email
            if (!userEmail) {
                return res.status(500).json({message: "No email address for specified user", success:false})
            }
            if (userEmail != email) {
                return res.status(400).json({message: "Email address does not match database records", success:false})
            }
            // username and email match
            // add entry to separate mongodb collection.
            const pwdResetRequest = await _createPwdResetRequest({username: username, email: email})
            if (pwdResetRequest.err) {
                return res.status(400).json({message: 'Could not create a password reset request!', success:false})
            }
            // the .id getter returns a string containing the mongoDB document id
            const requestId = pwdResetRequest.id
            // document added to mongodb collection
            const frontendUrl = process.env.FRONTEND_URL
            const pwdResetUrl = frontendUrl + "/" + requestId
            // const emailMessage = generateEmailMessage('zhen.teng@hotmail.com', username, pwdResetUrl)
            const emailMessage = generateEmailMessage(email, pwdResetUrl)
            try {
                await sgMail.send(emailMessage)
                console.log('Test email sent successfully');
            } catch (error) {
                console.error('Error sending test email');
                console.error(error);
                if (error.response) {
                    console.error(error.response.body)
                }
            }
            console.log(pwdResetUrl)
        } else {
            return res.status(404).json({message: 'User does not exist!', success:false});
        }
        
    }
    
}