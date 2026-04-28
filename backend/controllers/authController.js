const { verifySecurityAnswer } = require("../utils/authUtils");

exports.verifyStep = async (req, res) => {
  const { step, input, userId, required_auth } = req.body;

  let isValid = false;

  if (step === "otp") {
    isValid = input === "123456"; // replace with real OTP
  }

  if (step === "security_question") {
    isValid = await verifySecurityAnswer(userId, input);
  }

  if (step === "relative_approval") {
    // simulate approval (later: mobile app / API)
    isValid = true;
  }

  if (!isValid) {
    return res.json({ success: false });
  }

  const currentIndex = required_auth.indexOf(step);
  const nextStep = required_auth[currentIndex + 1];

  if (!nextStep) {
    return res.json({ success: true, completed: true });
  }

  res.json({
    success: true,
    next_step: nextStep
  });
};

