const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
  try {
    //Read the token from request cookie
    const cookie = req.cookies;
    const { token } = cookie;
    // Validate the token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized User" });
    }
    const isTokenValid = await jwt.verify(token, "DEV@TINDER2024");
    const { _id } = isTokenValid;
    // Find the User if Exists
    const user = await User.findById(_id);
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = { auth };
