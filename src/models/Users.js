const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 30,
      required: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 40,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Weak password");
        }
      },
    },
    age: {
      type: Number,
      required: true,
      min: 16,
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ["Male", "Female", "Others"],
        message: "{VALUE} is not supported",
      },
    },
    photoUrl: {
      type: String,
      required: true,
      default:
        "https://wallpapers.com/images/hd/netflix-profile-pictures-1000-x-1000-88wkdmjrorckekha.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photoUrl, please check !");
        }
      },
    },
    about: {
      type: String,
      required: true,
      default:
        "This is default about section, Please change it as per your wish",
      minlength: 15,
      maxlength: 250,
    },
    skills: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("User", userSchema);

module.exports = Users;
