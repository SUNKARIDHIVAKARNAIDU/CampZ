const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getAttendance,
} = require("../controllers/attendance");
const { verifyToken, requireRole } = require("../middleware/auth");

// Faculty marks attendance
router.post("/", verifyToken, requireRole("faculty"), markAttendance);

// All roles can view attendance (filtered)
router.get("/", verifyToken, getAttendance);

module.exports = router;
