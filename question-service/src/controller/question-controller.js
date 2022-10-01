const leetcode = require('../leetcode/leetcode.js')

const difficulties = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];

async function getQuestion(req, res) {
  try {
    var { titleSlug } = req.query;
    if (!titleSlug) {
      return res.status(400).json({ message: 'TitleSlug is missing', success: false })
    }

    var resp = await leetcode.getQuestion(titleSlug);
    if (resp.error) {
      console.log(`Get Leetcode question error: titleSlug=${titleSlug}, err=${resp.error}`);
      return res.status(500).json({ message: resp.error, success: false });
    }

    return res.status(200).json(resp);
  } catch (err) {
    console.log(`Get question error: ${err}`);
    res.status(500).json({ success: false });
  }
}

async function getQuestions(req, res) {
  try {
    var { difficulty, page, pageSize } = req.query;

    if (!difficulty || !page) {
      return res.status(400).json({ message: 'Difficulty and/or Page are missing', success: false })
    }

    if (!difficulties.includes(difficulty)) {
      console.log(`Invalid difficulty type! difficulty=${difficulty}`);
      return res.status(400).json({ message: 'Invalid difficulty type', success: false })
    }

    if (!pageSize) {
      pageSize = 10;
    }

    var resp = await leetcode.getQuestionList(difficulty, page, pageSize);
    if (resp.error) {
      console.log(`Get Leetcode questions error: ${resp.error}`);
      return res.status(500).json({ message: resp.error, success: false });
    }

    return res.status(200).json(resp);
  } catch (err) {
    console.log(`Get questions error: ${err}`);
    res.status(500).json({ success: false });
  }
}

module.exports = {
  getQuestion,
  getQuestions
}
