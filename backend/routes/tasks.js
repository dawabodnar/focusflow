const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const verifyToken = require("../verifyToken");

// ================= SSE =================

let clients = [];

router.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const clientId = Date.now();
  clients.push({ id: clientId, res });

  req.on("close", () => {
    clients = clients.filter(c => c.id !== clientId);
  });
});

function sendUpdate(userId) {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify({ userId })}\n\n`);
  });
}

// ================= Routes =================

router.post("/fetch", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "Missing credential" });
  try {
   const user = await verifyToken(credential);
    const tasks = await Task.find({ userId: user.userId });
    res.json(tasks);
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
});

router.post("/", async (req, res) => {
  const { credential, text } = req.body;
  if (!credential || !text) return res.status(400).json({ error: "Missing credential or text" });
  try {
    const user = await verifyToken(credential);
    const task = new Task({ userId: user.userId, text, completed: false });
    const savedTask = await task.save();
    sendUpdate(user.userId);
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
});

router.put("/:id", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "Missing credential" });
  try {
   const user = await verifyToken(credential);
    const task = await Task.findById(req.params.id);
    if (!task || task.userId !== user.userId) return res.status(404).json({ error: "Task not found" });
    const { text, completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { text, completed }, { new: true });
    sendUpdate(user.userId);
    res.json(updatedTask);
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
});

router.delete("/:id", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: "Missing credential" });
  try {
  const user = await verifyToken(credential);
    const task = await Task.findById(req.params.id);
    if (!task || task.userId !== user.userId) return res.status(404).json({ error: "Task not found" });
    await Task.findByIdAndDelete(req.params.id);
    sendUpdate(user.userId);
    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
});

module.exports = router;