const router = require("express").Router();
const { startTransaction } = require("../controllers/transactionController");

router.post("/", startTransaction);

module.exports = router;