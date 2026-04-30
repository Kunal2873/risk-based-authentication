const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

let relativeEmailOtp = null;

exports.verifyStep = async (req, res) => {
  console.log("verifyStep body:", req.body);
  const { step, input, required_auth } = req.body;

  let isValid = false;

  if (step === "otp") {
    isValid = input === "123456"; // replace with real OTP
  }

  if (step === "questionnaire") {
    isValid =
      input?.date_of_birth === "01/01/2000" &&
      input?.mothers_maiden_name === "sharma" &&
      input?.first_school === "dps";
  }

  if (step === "relative_email_otp") {
    if (!input || !String(input).trim()) {
      relativeEmailOtp = String(Math.floor(100000 + Math.random() * 900000));

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: process.env.RELATIVE_EMAIL,
        subject: "Your relative approval OTP",
        text: `Your OTP is ${relativeEmailOtp}`
      });

      return res.json({ success: true, message: "OTP sent" });
    }

    isValid = String(input).trim() === relativeEmailOtp;
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

