const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.verifyPassword = async (userId, input) => input === "password123";

exports.verifySecurityAnswer = async (userId, answer) => {
  const user = await User.findById(userId);
  return bcrypt.compare(answer.toLowerCase(), user.securityAnswerHash);
};

// Dummy TOTP (replace later with speakeasy)
exports.verifyTOTP = (input) => input === "123456";

exports.verifyVoiceOtp = (input) => input === "123456";
