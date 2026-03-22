const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Реєстрація
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email вже використовується" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, userId: user._id, name: user.name });
  } catch (err) {
    console.error("REGISTER ERROR:", err); 
  res.status(500).json({ error: err.message }); 
  }
});

// Вхід
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Невірний email або пароль" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Невірний email або пароль" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, userId: user._id, name: user.name });
  } catch (err) {
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// Отримати статистику
router.get("/stats", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ name: user.name, pomodoroCount: user.pomodoroCount, createdAt: user.createdAt });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Додати помодоро
router.post("/stats/pomodoro", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByIdAndUpdate(
      decoded.userId,
      { $inc: { pomodoroCount: 1 } },
      { new: true }
    );
    res.json({ pomodoroCount: user.pomodoroCount });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;