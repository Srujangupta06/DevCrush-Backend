const mongoose = require("mongoose");

// Create a User Schema

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  password: { type: String },
  gender: { type: String },
  age: { type: Number },
});

// Create a Model

const User = mongoose.model("user", userSchema);
module.exports = User
