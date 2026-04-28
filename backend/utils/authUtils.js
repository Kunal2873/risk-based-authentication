const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.verifyPassword = async (userId, input) => {
  const user = await User.findById(userId);
  return bcrypt.compare(input, user.password);
};

exports.verifySecurityAnswer = async (userId, answer) => {
  const user = await User.findById(userId);
  return bcrypt.compare(answer.toLowerCase(), user.securityAnswerHash);
};

// Dummy TOTP (replace later with speakeasy)
exports.verifyTOTP = (input) => input === "123456";