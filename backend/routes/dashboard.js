const express = require("express");
const router = express.Router();
const {
  getAdminDashboard,
  getFacultyDashboard,
  getStudentDashboard,
} = require("../controllers/dashboard");

const { verifyToken, requireRole } = require("../middleware/auth");

router.get("/admin", verifyToken, requireRole("admin"), getAdminDashboard);
router.get("/faculty", verifyToken, requireRole("faculty"), getFacultyDashboard);
router.get("/student", verifyToken, requireRole("student"), getStudentDashboard);

module.exports = router;
