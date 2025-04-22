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

module.exports = requestRouter;
