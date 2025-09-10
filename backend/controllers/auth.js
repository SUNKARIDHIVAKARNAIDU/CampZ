const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const [user] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 12);
    await pool.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [
      name,
      email,
      hashed,
      role,
    ]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
