const axios = require("axios");

exports.getRisk = async (data) => {
  const res = await axios.post("http://localhost:5000/predict", data);
  return res.data;
};