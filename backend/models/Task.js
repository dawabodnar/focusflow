const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  deadline: { type: Date, default: null },
    tag: { type: String, enum: ["work", "study", "personal", "none"], default: "none"},
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", taskSchema);