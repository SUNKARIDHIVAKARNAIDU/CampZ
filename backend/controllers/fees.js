const pool = require("../config/db");

// Admin creates a fee record for a student
exports.createFee = async (req, res) => {
  const { student_id, amount, due_date } = req.body;
  try {
    await pool.query(
      `INSERT INTO fees (student_id, amount, due_date) VALUES (?, ?, ?)`,
      [student_id, amount, due_date]
    );
    res.status(201).json({ message: "Fee assigned to student" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin updates the fee status (e.g., mark as paid)
exports.updateFeeStatus = async (req, res) => {
  const { id } = req.params;
  const { paid_status } = req.body;

  if (!["paid", "unpaid"].includes(paid_status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    await pool.query(
      `UPDATE fees SET paid_status = ? WHERE id = ?`,
      [paid_status, id]
    );
    res.json({ message: "Fee status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// All users can view fees (filtered by student or status)
exports.getFees = async (req, res) => {
  const { student_id, status } = req.query;
  let query = `
    SELECT f.*, u.name AS student_name
    FROM fees f
    JOIN students s ON f.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (student_id) {
    query += " AND f.student_id = ?";
    params.push(student_id);
  }

  if (status) {
    query += " AND f.paid_status = ?";
    params.push(status);
  }

  try {
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
