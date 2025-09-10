const pool = require("../config/db");

// ---------------- ADMIN DASHBOARD ----------------
exports.getAdminDashboard = async (req, res) => {
  try {
    const [
      [totalStudents],
      [feesCollected],
      [pendingFees],
      [lowAttendance],
      [topPerformers],
    ] = await Promise.all([
      pool.query("SELECT COUNT(*) AS total FROM students"),
      pool.query(`SELECT SUM(amount) AS collected FROM fees WHERE paid_status = 'paid'`),
      pool.query(`SELECT SUM(amount) AS pending FROM fees WHERE paid_status = 'unpaid'`),
      pool.query(`
        SELECT u.name, s.id AS student_id, 
               ROUND(100 * SUM(status = 'present') / COUNT(*), 2) AS attendance_percent
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        JOIN users u ON s.user_id = u.id
        GROUP BY a.student_id
        HAVING attendance_percent < 75
        LIMIT 5
      `),
      pool.query(`
        SELECT u.name, AVG(m.obtained_marks) AS avg_marks
        FROM marks m
        JOIN students s ON m.student_id = s.id
        JOIN users u ON s.user_id = u.id
        GROUP BY m.student_id
        ORDER BY avg_marks DESC
        LIMIT 5
      `),
    ]);

    res.json({
      total_students: totalStudents[0]?.total || 0,
      fees_collected: feesCollected[0]?.collected || 0,
      fees_pending: pendingFees[0]?.pending || 0,
      low_attendance_students: lowAttendance,
      top_performers: topPerformers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- FACULTY DASHBOARD ----------------
exports.getFacultyDashboard = async (req, res) => {
  const facultyId = req.user.id; // assuming user_id = faculty_id in `courses`
  try {
    const [courses] = await pool.query(
      `SELECT id, name FROM courses WHERE faculty_id = ?`,
      [facultyId]
    );

    const courseStats = await Promise.all(
      courses.map(async (course) => {
        const [attendance] = await pool.query(
          `SELECT ROUND(100 * SUM(status = 'present') / COUNT(*), 2) AS avg_attendance
           FROM attendance WHERE course_id = ?`,
          [course.id]
        );

        const [marks] = await pool.query(
          `SELECT ROUND(AVG(m.obtained_marks), 2) AS avg_marks
           FROM marks m
           JOIN exams e ON m.exam_id = e.id
           WHERE e.course_id = ?`,
          [course.id]
        );

        return {
          course_name: course.name,
          average_attendance: attendance[0]?.avg_attendance || 0,
          average_marks: marks[0]?.avg_marks || 0,
        };
      })
    );

    res.json({ courses: courseStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- STUDENT DASHBOARD ----------------
exports.getStudentDashboard = async (req, res) => {
  const studentUserId = req.user.id;

  try {
    // Get student ID from user ID
    const [studentData] = await pool.query(
      `SELECT id FROM students WHERE user_id = ?`,
      [studentUserId]
    );

    const studentId = studentData[0]?.id;
    if (!studentId) return res.status(404).json({ error: "Student not found" });

    const [
      [attendanceStats],
      [feeStatus],
      [marksStats],
    ] = await Promise.all([
      pool.query(`
        SELECT ROUND(100 * SUM(status = 'present') / COUNT(*), 2) AS attendance_percent
        FROM attendance WHERE student_id = ?
      `, [studentId]),

      pool.query(`
        SELECT 
          COUNT(*) AS total_fees,
          SUM(CASE WHEN paid_status = 'paid' THEN 1 ELSE 0 END) AS paid,
          SUM(CASE WHEN paid_status = 'unpaid' THEN 1 ELSE 0 END) AS unpaid
        FROM fees WHERE student_id = ?
      `, [studentId]),

      pool.query(`
        SELECT 
          ROUND(AVG(obtained_marks), 2) AS avg_marks,
          COUNT(*) AS total_exams
        FROM marks WHERE student_id = ?
      `, [studentId]),
    ]);

    res.json({
      attendance_percent: attendanceStats[0]?.attendance_percent || 0,
      fee_summary: {
        total: feeStatus[0]?.total_fees || 0,
        paid: feeStatus[0]?.paid || 0,
        unpaid: feeStatus[0]?.unpaid || 0,
      },
      marks_summary: {
        average_marks: marksStats[0]?.avg_marks || 0,
        exams_attempted: marksStats[0]?.total_exams || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
