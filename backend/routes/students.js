const express = require("express");
const router = express.Router();
const { getStudents, createStudent } = require("../controllers/students");
const { verifyToken, requireRole } = require("../middleware/auth");

router.get("/", verifyToken, requireRole("admin"), getStudents);
router.post("/", verifyToken, requireRole("admin"), createStudent);

module.exports = router;
