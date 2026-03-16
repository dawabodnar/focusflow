const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const tasksRouter = require("./routes/tasks");

const app = express();

app.use(cors());
app.use(express.json());



//  MongoDB 

mongoose.connect(
  process.env.MONGODB_URI
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));


const authRouter = require("./routes/auth");
app.use("/api/auth", authRouter);
//  Routes 

app.use("/api/tasks", tasksRouter);

app.get("/", (req, res) => {
  res.send("API works");
});

// Server 

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});