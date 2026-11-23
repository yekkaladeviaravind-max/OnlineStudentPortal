const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function validEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/students/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, rollNumber, department, year } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ message: "Enter a name with at least 2 characters." });
    }
    if (!validEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ message: "Password must contain at least 8 characters." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingStudent = await Student.findOne({ email: normalizedEmail });
    if (existingStudent) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const student = await Student.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      rollNumber: typeof rollNumber === "string" ? rollNumber.trim() : "",
      department: typeof department === "string" ? department.trim() : "",
      year: year === "" || year == null ? null : Number(year)
    });

    return res.status(201).json({ message: "Registration successful. You can now log in." });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error during registration." });
  }
});

// POST /api/students/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validEmail(email) || typeof password !== "string") {
      return res.status(400).json({ message: "Enter your email and password." });
    }

    const student = await Student.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!student) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, student.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { id: student._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful.",
      token,
      student: { name: student.name, email: student.email }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login." });
  }
});

// GET /api/students/profile (JWT protected)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.studentId).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student account not found." });
    }
    return res.json(student);
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ message: "Could not load student profile." });
  }
});

module.exports = router;
