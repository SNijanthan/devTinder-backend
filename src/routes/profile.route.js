const express = require("express");
const profileRouter = express.Router();
const Users = require("../models/Users");
const auth = require("../middlewares/Auth");
const bcrypt = require("bcrypt");
const {
  validateEditProfileData,
  validatePasswordData,
} = require("../utils/Validation");

//  ! For Viewing profile

profileRouter.get("/profile/view", auth, async (req, res) => {
  try {
    // * User already authenticated and user details attached in req.user

    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

//  ! For updating the profile

profileRouter.patch("/profile/edit", auth, async (req, res) => {
  try {
    // * This validateEditProfileData() is from validation helper function

    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }

    // * User id getting from req.user since user is already authorized

    const { _id } = req.user;

    const user = await Users.findByIdAndUpdate(_id, req.body, {
      runValidators: true,
      new: true,
    });

    if (!user) {
      throw new Error("User does not exist");
    }

    res
      .status(200)
      .send(
        `Hello ${
          user.lastName ? user.lastName : user.firstName
        }, your Profile has been updated successfully ..!`
      );
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

//  ! For changing passowrd

profileRouter.patch("/profile/forgot-password", auth, async (req, res) => {
  try {
    // * Checking whether the password is strong or not

    if (!validatePasswordData(req)) {
      throw new Error("Please enter strong password ");
    }

    const { password } = req.body;

    const { _id } = req.user;

    //  * Password field cannot be empty

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // * hashing the password

    const hashPassword = await bcrypt.hash(password, 10);

    //  * Updating the new password into DB

    const user = await Users.findByIdAndUpdate(
      _id,
      { password: hashPassword },
      { runValidators: true, new: true }
    );

    if (!user) {
      throw new Error("User does not exist");
    }

    // * Clearing cookie since passsword has been changed

    res
      .cookie("token", null, { expires: new Date(0), httpOnly: true })
      .status(200)
      .send("password updated successfully, Please login..!");
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

module.exports = profileRouter;
