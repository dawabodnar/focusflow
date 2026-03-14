const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const tasksRouter = require("./routes/tasks");
const verifyGoogleToken = require("./verifyGoogleToken");

const app = express();

app.use(cors());
app.use(express.json());

// Підключення до MongoDB
mongoose.connect(
  "mongodb+srv://daria_b:3DKeh1XNNhpBKtLf@daria.7qd9zvm.mongodb.net/focusflow?appName=Daria",
  {}
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));
// Підключаємо роутер тасок
app.use("/api/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.send("API works");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));