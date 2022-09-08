import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { registerHandlers } from './controller/match-controller.js';

app.get('/', (_, res) => res.send('Hello World from matching-service'))

const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", socket => {
  registerHandlers(io, socket);
});

httpServer.listen(8001, () => console.log('matching-service listening on port 8001'));
