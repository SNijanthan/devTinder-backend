const jwt = require("jsonwebtoken");
const Users = require("../models/Users.js");

require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ error: "Session expired, Please login" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findById(decoded._id);

    if (!user) {
      throw new Error("User not exist");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
};

module.exports = auth;
