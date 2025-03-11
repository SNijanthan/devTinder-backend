const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/Auth");
const ConnectionRequest = require("../models/ConnectionRequest");

userRouter.get("/user/review/connections", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      connectionStatus: "interested",
    }).populate("fromUserId", "firstName lastName age gender about photoUrl skills");

    if (connectionRequests.lenght === 0) {
      throw new Error("No connections received..!");
    }

    res
      .status(200)
      .json({ message: "Data retrieved successfully..!", connectionRequests });
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

module.exports = userRouter;
