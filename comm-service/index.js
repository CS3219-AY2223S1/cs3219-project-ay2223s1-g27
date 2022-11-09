import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerChatHandlers } from './controller/comm-controller.js';
import { authorize } from '@thream/socketio-jwt';
import { initMQ } from './mq.js';
import { initMatchInfoRedisClient } from './services/redis.js';
import 'dotenv/config'

const app = express();
const PORT = 8004;
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (_, res) => res.send('Hello World from communication-service'))

const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: "/api/comm/chat"
});

import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const redis_host = process.env.REDIS_HOST;
const redis_port = process.env.REDIS_PORT;
const redis_password = process.env.REDIS_PASSWORD;

const redisUrl = 'redis://default:' + redis_password + '@' + redis_host + ':' + redis_port

const pubClient = createClient({ url: redisUrl });
const subClient = pubClient.duplicate();

initMatchInfoRedisClient(redis_host, redis_port, redis_password);
initMQ();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));

  io.use(
    authorize({
      secret: process.env.JWT_ACCESS_SECRET,
      onAuthentication: async (decodedToken) => {
        return decodedToken.username;
      }
    })
  )

  io.on('connection', clientSocket => {
    console.log(`New Joiner: ${clientSocket.user}`)
    registerChatHandlers(io, clientSocket)
  });

  httpServer.listen(PORT, () => console.log(`communication-service listening on port ${PORT}`));
});
