const express = require("express");
const router = express.Router();
const {
  createExam,
  getExams,
  recordMarks,
  getMarks,
} = require("../controllers/exams");

const { verifyToken, requireRole } = require("../middleware/auth");

router.post("/", verifyToken, requireRole(["admin", "faculty"]), createExam);
router.get("/", verifyToken, getExams);

router.post("/marks", verifyToken, requireRole("faculty"), recordMarks);
router.get("/marks", verifyToken, getMarks);

module.exports = router;
