const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const verifyGoogleToken = require('./verifyGoogleToken');

const app = express();

app.use(cors());            

app.use(express.json());

mongoose.connect(
  "mongodb+srv://daria_b:3DKeh1XNNhpBKtLf@daria.7qd9zvm.mongodb.net/?appName=Daria",
  { }
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

const taskSchema = new mongoose.Schema({
  userId: String,
  text: String,
  completed: Boolean
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);
app.get("/", (req, res) => {
  res.send("API works");
});
// Отримати всі задачі користувача
app.get("/api/tasks/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Додати нову задачу
app.post("/api/tasks", async (req, res) => {
    const { credential, text } = req.body;
    try {
        const user = await verifyGoogleToken(credential);  
        const newTask = new Task({
            userId: user.userId,  
            text,
            completed: false
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(401).json({ message: "Невалідний Google token" });
    }
});

// Видалити задачу
app.delete("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Оновити задачу
app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));