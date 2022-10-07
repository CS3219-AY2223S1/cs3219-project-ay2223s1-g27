require('dotenv/config')

const configs = require('../config.js');
const axios = require('axios');

const checkStatus = async (token) => {
  const options = {
    method: "GET",
    url: configs.rapid.url + configs.rapid.submission + "/" + token,
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
      "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
    },
  };
  try {
    let response = await axios.request(options);
    let statusId = response.data.status?.id;

    // Processed - we have a result
    if (statusId === 1 || statusId === 2) {
      // still processing
      setTimeout(() => {
        checkStatus(token);
      }, 2000);
      return;
    } else {
      return { data: response.data };
    }
  } catch (err) {
    console.log("err", err);
    return { err: err }
  }
};

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
    params: { base64_encoded: "true", fields: "*" },
    headers: headers,
    data: formData
  }

  try {
    axios
      .request(options)
      .then(function(response) {
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log(`too many requests, err: ${error}`, status);
          return { error: 'Quota of 50 requests exceeded for the day!' }
        }
      });

  } catch (err) {
    console.log(`Rapid judge err: ${err}`);
    return { error: err };
  }
}

module.exports = {
  compile
}
