const express = require("express");
const requestRouter = express.Router();
const { auth } = require("../middlewares/adminAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/send/:status/:toUserId", auth, async (req, res) => {
  try {
    const { user } = req;
    const fromUserId = user._id;
    const { toUserId } = req.params;
    const { status } = req.params;
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res
        .status(400)
        .json({ message: `Invalid Status Type: ${status}` });
    }

    // Check the connection request is already exists or not (from user to me) or (me to user)
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res
        .status(400)
        .json({ message: "Connection Request Already Sent" });
    }

    const existingToUser = await User.findById(toUserId);
    if (!existingToUser) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    await connectionRequest.save();
    const requestMessage =
      status === "interested"
        ? `${req.user.firstName} is Interested in ${existingToUser.firstName} Profile`
        : `${req.user.firstName} is Ignored ${existingToUser.firstName} Profile`;
    res.json({ message: requestMessage });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

requestRouter.post("/review/:status/:requestId", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status,requestId } = req.params;
    // Validate the Status
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Invalid Status type:${status}` });
    }
    // Request id Should be valid
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection Request Not Found" });
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    return res.json({ message: `Connection Request is ${status}`, data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = requestRouter;
