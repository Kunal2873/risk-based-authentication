const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: String,
  recipient: String,
  accountNumber: String,
  amount: Number,
  riskLevel: String,
  authSteps: [String],
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "success"
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);
