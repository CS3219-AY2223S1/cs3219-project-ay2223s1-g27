import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { createUser, loginUser, deleteUser, updatePassword } from './controller/user-controller.js';
import { validateAccessToken, renewAccessAndRefreshTokens, invalidateRefreshToken } from './controller/user-token-handler.js';

const router = express.Router()

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'))
// to create a new user: post request body: {"username":"<username>", "password":"<password>"}
router.post('/', createUser)
// to obtain the access and refresh tokens: post request body: {"username":"<username>", "password":"<password>"}
router.post('/login', loginUser)
// get request body: {"token":"<token>"}
router.post('/validateaccesstoken', validateAccessToken)
router.post('/renewtokens', renewAccessAndRefreshTokens)
router.post('/logout', invalidateRefreshToken)
router.delete('/deleteuser', deleteUser)
router.put('/updatepassword', updatePassword)


app.use('/api/user', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(8000, () => console.log('user-service listening on port 8000'));