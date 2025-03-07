const express = require("express");
const authRouter = express.Router();
const validateSignUpData = require("../utils/Validation.js");
const Users = require("../models/Users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ! Registers a new user

authRouter.post("/signup", async (req, res) => {
  try {
    // ! Validating incoming data

    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    // ! Checking if the email address already present in DB

    const existingUser = await Users.findOne({ emailId });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    // ! After validating data, hash password has been created

    const hashPassword = await bcrypt.hash(password, 10);

    // ! Creating new instance to add into DB

    const user = new Users({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    await user.save();

    res.status(201).send("Signin successfully, Please login");
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

// ! User login

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // ! Check if user exists

    const existingUser = await Users.findOne({ emailId });

    if (!existingUser) {
      throw new Error("Incorrect credentials");
    }

    // ! Compare passwords

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new Error("Incorrect credentials");
    }

    // ! Generate JWT Token

    if (isPasswordValid) {
      const token = await jwt.sign({ _id: existingUser._id }, "DEVTINDER@123", {
        expiresIn: "1d",
      });

      res.cookie("token", token, { httpOnly: true });
      res.status(200).send("Login successfull");
    }
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

module.exports = authRouter;
