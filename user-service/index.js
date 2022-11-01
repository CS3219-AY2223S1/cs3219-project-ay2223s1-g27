import express from 'express';
import cors from 'cors';
import 'dotenv/config'

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions)) // config cors so that front-end can use

app.get("/", (req, res) => res.send("Hello World from user-service"))

import { createUser, loginUser, deleteUser, updatePassword, resetPassword } from './controller/user-controller.js';
import { validateAccessToken, renewAccessAndRefreshTokens, invalidateRefreshToken } from './controller/user-token-handler.js';
import { sendPasswordResetEmail } from './controller/pwd-reset-controller.js';
import { questionHistory, saveQuestion, saveMessage, getMessage } from './controller/question-history-controller.js';
import { initMQ } from './mq.js';

initMQ();

const router = express.Router()

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'))
router.post('/createuser', createUser)
router.post('/login', loginUser)
router.post('/validateaccesstoken', validateAccessToken)
router.post('/renewtokens', renewAccessAndRefreshTokens)
router.post('/logout', invalidateRefreshToken)
router.delete('/delete', deleteUser)
router.put('/updatepassword', updatePassword)
router.put('/resetpassword', resetPassword)
router.post('/sendresetlink', sendPasswordResetEmail)
router.get('/questionhistory', questionHistory)
router.post('/savequestion', saveQuestion)
router.post('/message', saveMessage).get('/message', getMessage)

app.use('/api/user', router)

app.listen(8000, () => console.log('user-service listening on port 8000'));
