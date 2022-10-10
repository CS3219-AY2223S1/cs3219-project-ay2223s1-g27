import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerChatHandlers } from './controller/comm-controller.js';

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

io.on('connection', clientSocket => {
  registerChatHandlers(io, clientSocket)
});



httpServer.listen(PORT, () => console.log('communication-service listening on port ${PORT}'));


