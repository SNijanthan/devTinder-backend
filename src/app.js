const express = require("express");
const { connectToDatabase } = require("./config/Database");
const Users = require("./models/Users");
const validateSignUpData = require("./utils/Validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { auth } = require("./middlewares/Auth");

const app = express();

const port = 7000;

app.use(express.json());
app.use(cookieParser());

// New user signing in

app.post("/signin", async (req, res) => {
  try {
    // Request validation
    validateSignUpData(req);

    // Password Hashing

    const { firstName, lastName, emailId, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    // Creating new instance of the User to store data into DB

    const user = new Users({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    await user.save();

    res.status(200).send("Signin successful");
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

// Logining in user

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Checking whether emailId is present in DB

    const user = await Users.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    // Comparing hashed password with password stored in DB

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Creating JWT Token

      const token = await jwt.sign({ _id: user._id }, "DEV@TINDER@123", {
        expiresIn: "1d",
      });

      // Attach Token to cookie and send it to User

      res.cookie("token", token);

      res.status(200).send("Login successfull");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

// Update your details after login

app.patch("/profile/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const data = req.body;

    const allowedFields = ["password", "gender", "photoUrl", "about", "skills"];

    const isAllowedFields = Object.keys(data).every((k) =>
      allowedFields.includes(k)
    );

    if (!isAllowedFields) {
      throw new Error("Update not allowed");
    }

    const user = await Users.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      throw new Error("User not exist");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

// Get User by ID

app.get("/user", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

// Get all users

app.get("/feed", async (req, res) => {
  try {
    const users = await Users.find();
    if (!users) {
      throw new Error("No users registered yet !");
    } else {
      res.status(200).json({
        status: "success",
        messgae: "Users has been fetched",
        data: users,
      });
    }
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

connectToDatabase()
  .then(() => {
    console.log("Connected to DB successfully");
    app.listen(port, () => {
      console.log(`Connected to port: ${port}`);
    });
  })
  .catch((err) => {
    console.error(`DB connection failed: ${err.message}`);
  });
