const judge = require('../rapid_api/judge.js')

async function compile(req, res) {
  try {
    var formData = req.body;
    var resp = await judge.compile(formData);

    if (resp.error) {
      console.log(`compile api error: err=${resp.error}`);
      return res.status(500).json({ error: resp.error, success: false });
    }

    return res.status(200).json(resp);
  } catch (err) {
    console.log(`compile api error: ${err}`);
    res.status(500).json({ success: false });
  }
}

module.exports = {
  compile
}
