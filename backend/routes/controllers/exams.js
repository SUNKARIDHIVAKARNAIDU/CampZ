const pool = require("../config/db");

// Create a new exam
exports.createExam = async (req, res) => {
  const { course_id, date, total_marks, exam_name } = req.body;
  try {
    await pool.query(
      "INSERT INTO exams (course_id, date, total_marks, exam_name) VALUES (?, ?, ?, ?)",
      [course_id, date, total_marks, exam_name]
    );
    res.status(201).json({ message: "Exam created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get exams (optionally filter by course or date)
exports.getExams = async (req, res) => {
  const { course_id, date } = req.query;
  let query = `SELECT e.*, c.name AS course_name FROM exams e
               JOIN courses c ON e.course_id = c.id WHERE 1=1`;
  const params = [];

  if (course_id) {
    query += " AND e.course_id = ?";
    params.push(course_id);
  }
  if (date) {
    query += " AND e.date = ?";
    params.push(date);
  }

  try {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Record marks for students
exports.recordMarks = async (req, res) => {
  const { exam_id, marks } = req.body;
  // marks = [{ student_id: 1, obtained_marks: 45 }, ...]

  if (!Array.isArray(marks)) {
    return res.status(400).json({ message: "Invalid format" });
  }

  try {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    for (const entry of marks) {
      const { student_id, obtained_marks } = entry;

      await conn.query(
        `INSERT INTO marks (exam_id, student_id, obtained_marks)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE obtained_marks = ?`,
        [exam_id, student_id, obtained_marks, obtained_marks]
      );
    }

    await conn.commit();
    conn.release();
    res.status(201).json({ message: "Marks recorded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get marks (filter by student or exam)
exports.getMarks = async (req, res) => {
  const { student_id, exam_id } = req.query;
  let query = `SELECT m.*, u.name AS student_name, e.exam_name, e.total_marks, c.name AS course_name
               FROM marks m
               JOIN students s ON m.student_id = s.id
               JOIN users u ON s.user_id = u.id
               JOIN exams e ON m.exam_id = e.id
               JOIN courses c ON e.course_id = c.id
               WHERE 1=1`;
  const params = [];

  if (student_id) {
    query += " AND m.student_id = ?";
    params.push(student_id);
  }

  if (exam_id) {
    query += " AND m.exam_id = ?";
    params.push(exam_id);
  }

  try {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
