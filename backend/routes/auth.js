const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
// Отримати статистику
router.get("/stats", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      name: user.name,
      pomodoroCount: user.pomodoroCount,
      createdAt: user.createdAt,
    });
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