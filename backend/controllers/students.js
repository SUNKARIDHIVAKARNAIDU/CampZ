const pool = require("../config/db");

exports.getStudents = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.id, u.name, u.email, s.year
      FROM students s
      JOIN users u ON u.id = s.user_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  const { name, email, password, course_id, year } = req.body;

  try {
    const [userExists] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (userExists.length) return res.status(409).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 12);
    const [userResult] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')",
      [name, email, hashed]
    );

    await pool.query(
      "INSERT INTO students (user_id, course_id, year) VALUES (?, ?, ?)",
      [userResult.insertId, course_id, year]
    );

    res.status(201).json({ message: "Student created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
