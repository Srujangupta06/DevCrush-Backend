const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "DEV@TINDER2024", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (incomingPassword) {
  const user = this;
  const hashedPassword = user.password;
  const isPasswordValid = await bcrypt.compare(incomingPassword, hashedPassword);
  return isPasswordValid;
};
// Create a Model

const User = mongoose.model("user", userSchema);
module.exports = User;
