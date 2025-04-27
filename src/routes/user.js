const express = require("express");
const { auth } = require("../middlewares/adminAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

// Get all pending connection request of logged in user
userRouter.get("/requests/received", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "avatar"]);
    //.populate("fromUserId", "firstName lastName");
    res.json({ message: "Data Fetched Successfully", connectionRequests });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

userRouter.get("/connections", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName avatar gender bio skills age")
      .populate("toUserId", "firstName lastName avatar gender bio skills age");
    const data = connectionRequests.map((eachUser) => {
      if (eachUser.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return eachUser.toUserId;
      }
      return eachUser.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Get feed of all other user

userRouter.get("/feed", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pageNumber = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit >= 50 ? 50 : limit;
    const skipFeed = (pageNumber - 1) * limit;
    // Get all feed of User except logged in user
    // Only show feed of user who don't have any connection request with logged in user
    // Once feed is ignored, it will not be shown again
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName avatar gender bio skills")
      .skip(skipFeed)
      .limit(limit);
    res.send(users);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
