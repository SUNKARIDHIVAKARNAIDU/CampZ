const express = require("express");
const router = express.Router();
const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const { verifyToken, requireRole } = require("../middleware/auth");

router.get("/", verifyToken, getCourses);
router.post("/", verifyToken, requireRole("admin"), createCourse);
router.put("/:id", verifyToken, requireRole("admin"), updateCourse);
router.delete("/:id", verifyToken, requireRole("admin"), deleteCourse);

module.exports = router;
