const express = require("express");
const router = express.Router();
const {
  createFee,
  updateFeeStatus,
  getFees,
} = require("../controllers/fees");

const { verifyToken, requireRole } = require("../middleware/auth");

router.post("/", verifyToken, requireRole("admin"), createFee);
router.put("/:id", verifyToken, requireRole("admin"), updateFeeStatus);
router.get("/", verifyToken, getFees);

module.exports = router;
