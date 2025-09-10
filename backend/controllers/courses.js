const pool = require("../config/db");

exports.getCourses = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT c.id, c.name, c.department, u.name as faculty FROM courses c LEFT JOIN users u ON c.faculty_id = u.id"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCourse = async (req, res) => {
  const { name, department, faculty_id } = req.body;
  try {
    await pool.query(
      "INSERT INTO courses (name, department, faculty_id) VALUES (?, ?, ?)",
      [name, department, faculty_id]
    );
    res.status(201).json({ message: "Course created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const { name, department, faculty_id } = req.body;
  try {
    await pool.query(
      "UPDATE courses SET name = ?, department = ?, faculty_id = ? WHERE id = ?",
      [name, department, faculty_id, courseId]
    );
    res.json({ message: "Course updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  const courseId = req.params.id;
  try {
    await pool.query("DELETE FROM courses WHERE id = ?", [courseId]);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
