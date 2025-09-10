const pool = require("../config/db");

// POST /api/attendance
exports.markAttendance = async (req, res) => {
  const { date, course_id, records } = req.body;
  // records = [{ student_id: 1, status: 'present' }, ...]
  if (!Array.isArray(records)) {
    return res.status(400).json({ message: "Invalid records format" });
  }

  try {
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    for (const record of records) {
      const { student_id, status } = record;

      await conn.query(
        `INSERT INTO attendance (student_id, course_id, date, status)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = ?`,
        [student_id, course_id, date, status, status]
      );
    }

    await conn.commit();
    conn.release();
    res.status(201).json({ message: "Attendance marked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/attendance?student_id=1&course_id=2&date=2025-09-01
exports.getAttendance = async (req, res) => {
  const { student_id, course_id, date } = req.query;

  let query = `SELECT a.*, u.name as student_name, c.name as course_name
               FROM attendance a
               JOIN students s ON a.student_id = s.id
               JOIN users u ON s.user_id = u.id
               JOIN courses c ON a.course_id = c.id
               WHERE 1=1`;
  const params = [];

  if (student_id) {
    query += " AND a.student_id = ?";
    params.push(student_id);
  }

  if (course_id) {
    query += " AND a.course_id = ?";
    params.push(course_id);
  }

  if (date) {
    query += " AND a.date = ?";
    params.push(date);
  }

  try {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
