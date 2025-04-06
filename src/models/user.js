const mongoose = require("mongoose");

// Create a User Schema

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, trim: true, minLength: 8 },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender is not Valid");
        }
      },
    },
    age: { type: Number, min: 18 },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCpY5LtQ47cqncKMYWucFP41NtJvXU06-tnQ&s",
    },
    bio: { type: String, default: "Default Bio of User", trim: true },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

// Create a Model

const User = mongoose.model("user", userSchema);
module.exports = User;
