const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/Auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const Users = require("../models/Users");

const USER_SAFE_DATA = "firstName lastName age gender about photoUrl skills";

// ! Retrieves received connection requests - "interested"

userRouter.get("/user/review/connections", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      connectionStatus: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

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

// ! Review all the connections

userRouter.get("/user/connections", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, connectionStatus: "accepted" },
        { fromUserId: loggedInUser._id, connectionStatus: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    if (connectionRequests.length === 0) {
      throw new Error("No matching connections..!");
    }

    // * We cannot compare mongoID's like strings() so we should use equals()

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({ message: "Data retrived successfully..!", data });
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

// ! Retrieve all the users from DB

userRouter.get("/user/feed", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideusersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideusersFromFeed.add(req.fromUserId.toString());
      hideusersFromFeed.add(req.toUserId.toString());
    });

    const users = await Users.find({
      $and: [
        {
          _id: { $nin: Array.from(hideusersFromFeed) },
        },
        { _id: { $ne: loggedInUser._id } },
      ],
    });

    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

module.exports = userRouter;
