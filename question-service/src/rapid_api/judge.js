require('dotenv/config')

const configs = require('../config.js');
const axios = require('axios');

async function compile(formData) {
  const headers = {
    "content-type": "application/json",
    "Content-Type": "application/json",
    "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
    "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
  }

  const options = {
    method: "POST",
    url: `${configs.rapid.url}${configs.rapid.submission}`,
    params: { base64_encoded: "true", wait: "true", fields: "*" },
    headers: headers,
    data: formData
  }

  try {
    const res = await axios
      .request(options)
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        return { error: error };
      });

    if (res.status == 429) {
      console.log(`too many requests, err: ${error}`, res.status);
      return { error: 'Quota of 50 requests exceeded for the day!' }
    }

    if (res.error) {
      return res;
    }

    return res.data;
  } catch (err) {
    console.log(`Rapid judge err: ${err}`);
    return { error: err };
  }
}

module.exports = {
  compile
}
