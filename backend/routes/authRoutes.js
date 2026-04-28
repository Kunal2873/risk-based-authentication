const router = require("express").Router();
const { verifyStep } = require("../controllers/authController");

router.post("/verify", verifyStep);

module.exports = router;