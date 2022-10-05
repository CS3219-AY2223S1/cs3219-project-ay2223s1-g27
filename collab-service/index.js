import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { authorize } from '@thream/socketio-jwt';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { registerHandlers } from './controller/collab-controller.js';

app.get('/', (_, res) => res.send('Hello World from collab-service'))

const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: "/api/collab"
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

httpServer.listen(8003, () => console.log('collab-service listening on port 8003'));
