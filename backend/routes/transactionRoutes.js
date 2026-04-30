const router = require("express").Router();
const { startTransaction } = require("../controllers/transactionController");
const Transaction = require("../models/Transaction");

router.post("/", startTransaction);
router.post("/save", async (req, res) => {
  try {
    const { userId, recipient, accountNumber, amount, riskLevel, authSteps } = req.body;

    const transaction = new Transaction({
      userId,
      recipient,
      accountNumber,
      amount,
      riskLevel,
      authSteps
    });

    await transaction.save();

    return res.json({ success: true, transaction });
  } catch (error) {
    console.error("Failed to save transaction:", error);
    return res.status(500).json({ success: false, message: "Failed to save transaction" });
  }
});

module.exports = router;
