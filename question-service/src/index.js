const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.get("/", (req, res) => res.send("Hello World from question-service"))

const { getQuestion, getQuestions } = require('./controller/question-controller.js');

const router = express.Router()

router.get('/', (_, res) => res.send('Hello World from question-service'))
router.get('/question', getQuestion)
router.get('/questions', getQuestions)

app.use('/api/question', router)

app.listen(8002, () => console.log('question-service listening on port 8002'));
