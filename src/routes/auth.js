const express = require("express");
const authRouter = express.Router();
const { validateSignUp } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
authRouter.post("/signup", async (req, res) => {
  // Incoming user info
  const { firstName, lastName, email, password, age, gender } = req.body;

  try {
    // Validation
    validateSignUp(req);

    // Encryption
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating a new instance of User Model
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      age,
    });

    // Inserting document into user Collection
    const savedUser = await newUser.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    // Send Response to client
    res.json({ data: savedUser, message: "Registration Successfull" });
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check the User exists or not
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    } else {
      // Check the Password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // Create a Jwt Token
        const token = await user.getJWT();

        // add the token to cookie and send back the response to user
        res.cookie(
          "token",
          token,

          { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) }
        );
        res.json({ data: user });
      } else {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.json({ message: "Logout Successfull" });
});
module.exports = authRouter;
