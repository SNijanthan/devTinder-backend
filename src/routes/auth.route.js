const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateSignUpData } = require("../utils/Validation.js");
const Users = require("../models/Users.js");
const auth = require("../middlewares/Auth.js");
const hashPassword = require("../utils/hashPassword.js");

require("dotenv").config();

// ! Registers a new user

authRouter.post("/signup", async (req, res) => {
  try {
    // * Validating incoming data

    validateSignUpData(req);

    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photoUrl,
      about,
      skills,
    } = req.body;

    // * Checking if the email address already present in DB

    const existingUser = await Users.findOne({ emailId });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    // * After validating data, hash password has been created using helper function => hashPassword

    const hashedPassword = await hashPassword(password);

    // * Creating new instance to add into DB

    const user = new Users({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      gender,
      photoUrl,
      about,
      skills,
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

    if (!emailId || !password) {
      throw new Error("Fields cannot be empty");
    }

    // * Check if user exists

    const existingUser = await Users.findOne({ emailId });

    if (!existingUser) {
      throw new Error("Incorrect credentials");
    }

    // * Compare passwords

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new Error("Incorrect credentials");
    }

    // * Generate JWT Token

    if (isPasswordValid) {
      const token = jwt.sign(
        { _id: existingUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("token", token, { httpOnly: true });
      res
        .status(200)
        .json({ message: "Login successfull", user: existingUser });
    }
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

// ! User logout

authRouter.post("/logout", auth, async (req, res) => {
  try {
    // * Token => null, So it will expire cookie and it will logout user

    res
      .cookie("token", null, { expires: new Date(0), httpOnly: true })
      .status(200)
      .json({
        message: `User ${req.user.firstName} ${req.user.lastName} logged out`,
      });
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

module.exports = authRouter;
