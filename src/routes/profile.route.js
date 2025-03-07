const express = require("express");
const profileRouter = express.Router();
const Users = require("../models/Users");
const auth = require("../middlewares/Auth");

profileRouter.get("/profile", auth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

module.exports = profileRouter;
