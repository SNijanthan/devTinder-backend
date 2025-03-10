const express = require("express");
const auth = require("../middlewares/Auth");
const Users = require("../models/Users");
const ConnectionRequest = require("../models/ConnectionRequest.js");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  auth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status.toLowerCase();

      // ! Corner cases

      // * If toUserId is not exist in DB

      const isUserExist = await Users.findById(toUserId);

      if (!isUserExist) {
        throw new Error("User not exist");
      }

      // * Only "interested" and "ignored" statuses can be accepted as status

      const allowedEntries = ["interested", "ignored"];

      if (!allowedEntries.includes(status)) {
        throw new Error("Invalid status");
      }

      // * Once request sent, Cannot able to send the request again

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection request already exist ..!");
      }

      // * Creating new instance and entry saved to DB

      const data = new ConnectionRequest({
        fromUserId,
        toUserId,
        connectionStatus: status.toLowerCase(),
      });

      await data.save();

      res.status(200).send("Connection sent successfully..!");
    } catch (error) {
      res.status(400).send(`Error: ${error.message}`);
    }
  }
);

module.exports = requestRouter;
