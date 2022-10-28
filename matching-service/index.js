import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { authorize } from '@thream/socketio-jwt';
import { initMQ } from './mq.js';

initMQ();

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { registerHandlers } from './controller/match-controller.js';

app.get('/', (_, res) => res.send('Hello World from matching-service'))

const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: "/api/matching"
});

io.use(
  authorize({
    secret: process.env.JWT_ACCESS_SECRET,
    onAuthentication: async (decodedToken) => {
      return decodedToken.username;
    }
  })
);

io.on("connection", socket => {
  registerHandlers(io, socket);
});

httpServer.listen(8001, () => console.log('matching-service listening on port 8001'));
