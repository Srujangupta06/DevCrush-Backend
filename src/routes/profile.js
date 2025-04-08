const express = require("express");
const profileRouter = express.Router();
const { auth } = require("../middlewares/adminAuth");
const { validateMyProfileEditData } = require("../utils/validation");
const validator = require("validator");
profileRouter.get("/view", auth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/edit", auth, async (req, res) => {
  try {
    if (!validateMyProfileEditData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your Profile Updated Successfully`,
      updatedData: loggedInUser,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

profileRouter.patch("/forgot-password", auth, (req, res) => {
  try {
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = profileRouter;
