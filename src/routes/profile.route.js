const express = require("express");
const profileRouter = express.Router();
const Users = require("../models/Users");
const auth = require("../middlewares/Auth");

profileRouter.get("/profile/view", auth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

profileRouter.patch("/profile/edit", auth, async (req, res) => {
  try {
    // * User id getting from req.user since user is already authorized
    const { _id } = req.user;

    // * Only these filds can be updated

    const ALLOWED_FIELDS = [
      "firstName",
      "lastName",
      "password",
      "photoUrl",
      "about",
      "skills",
      "gender",
    ];

    const isAllowedFields = Object.keys(req.body).every((k) =>
      ALLOWED_FIELDS.includes(k)
    );

    if (!isAllowedFields) {
      throw new Error("Field cannot be updated");
    }

    const user = await Users.findByIdAndUpdate(_id, req.body, {
      runValidators: true,
      returnDocument: "after",
    });

    if (!user) {
      throw new Error("User does not exist");
    }

    res.status(200).send("Edit profile call");
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

module.exports = profileRouter;
