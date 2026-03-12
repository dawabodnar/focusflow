const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  userId: String,     
  text: String,       
  completed: Boolean,  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Task", taskSchema);