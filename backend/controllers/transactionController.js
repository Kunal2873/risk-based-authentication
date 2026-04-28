const { getRisk } = require("../service/mlService");

exports.startTransaction = async (req, res) => {
  const mlResult = await getRisk(req.body);

  res.json({
    risk_level: mlResult.risk_level,
    required_auth: mlResult.required_auth,
    step: mlResult.required_auth[0] // start step
  });
};
