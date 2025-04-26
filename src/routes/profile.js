const express = require("express");
const profileRouter = express.Router();
const { auth } = require("../middlewares/adminAuth");
const { validateMyProfileEditData } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");
const upload = require("../middlewares/multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const uploadByCloudinary = async (filepath) => {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      folder: "DevCrush",
    });
    return result.secure_url;
  } catch (err) {
    throw new Error("Cloudinary Upload Error: " + err.message);
  }
};

profileRouter.get("/view", auth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch(
  "/edit",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const file = req.file;
      if (!validateMyProfileEditData(req)) {
        throw new Error("Invalid Edit Request");
      }
      if (file) {
        const profileImgUrl = await uploadByCloudinary(file.path);
        loggedInUser.avatar = profileImgUrl;
        fs.unlinkSync(req.file.path);
      }

      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key])
      );

      await loggedInUser.save();
      res.json({
        message: `${loggedInUser.firstName}, your Profile Updated Successfully`,
        updatedData: loggedInUser,
      });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  }
);

profileRouter.patch("/forgot-password", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { newPassword, email } = req.body;
    if (!email || !newPassword) {
      throw new Error("Email and Password is Required");
    }
    if (email !== loggedInUser.email) {
      throw new Error("Invalid Email");
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Your Password must be Strong");
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = newHashedPassword;
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your Password Updated Successfully`,
      updatedData: loggedInUser,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = profileRouter;
