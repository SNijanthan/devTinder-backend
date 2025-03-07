const jwt = require("jsonwebtoken");
const Users = require("../models/Users");

const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Session expired, Please login");
    }

    const isTokenValid = await jwt.verify(token, "DEV@TINDER@123");

    const { _id } = isTokenValid;

    const user = await Users.findById(_id);

    if (!user) {
      throw new Error("User not exist");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
};

module.exports = { auth };
