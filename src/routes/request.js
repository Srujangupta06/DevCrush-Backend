const express = require("express");
const requestRouter = express.Router();
const {auth} = require("../middlewares/adminAuth");

requestRouter.post("/send-connnection-request", auth, async (req, res) => {
  try {
    const { user } = req;
    res.send(`${user.firstName} is Sending Connection Request`);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = requestRouter;
