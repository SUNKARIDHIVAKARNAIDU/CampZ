const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("College Management API");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const courseRoutes = require("./routes/courses");
app.use("/api/courses", courseRoutes);
const attendanceRoutes = require("./routes/attendance");
app.use("/api/attendance", attendanceRoutes);
const examRoutes = require("./routes/exams");
app.use("/api/exams", examRoutes);
const feeRoutes = require("./routes/fees");
app.use("/api/fees", feeRoutes);
const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);
