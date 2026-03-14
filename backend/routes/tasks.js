const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const verifyGoogleToken = require("../verifyGoogleToken");

// Отримати всі задачі користувача
router.post("/fetch", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "Missing credential" });

  try {
    const user = await verifyGoogleToken(credential);
    const tasks = await Task.find({ userId: user.userId });
    res.json(tasks);
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// Додати нову задачу
router.post("/", async (req, res) => {
  const { credential, text } = req.body;
  if (!credential || !text) return res.status(400).json({ error: "Missing credential or text" });

  try {
    const user = await verifyGoogleToken(credential);
    const task = new Task({
      userId: user.userId,
      text,
      completed: false,
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// Оновити задачу (completed, text)
router.put("/:id", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "Missing credential" });

  try {
    const user = await verifyGoogleToken(credential);
    const task = await Task.findById(req.params.id);
    if (!task || task.userId !== user.userId) {
      return res.status(404).json({ error: "Task not found" });
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// Видалити задачу
router.delete("/:id", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "Missing credential" });

  try {
    const user = await verifyGoogleToken(credential);
    const task = await Task.findById(req.params.id);
    if (!task || task.userId !== user.userId) {
      return res.status(404).json({ error: "Task not found" });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
});

module.exports = router;