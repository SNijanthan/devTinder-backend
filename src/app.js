const express = require("express");
const app = express();
const { connectToDatabase } = require("./config/Database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173", // Whitelisting domain name
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.route.js");
const profileRouter = require("./routes/profile.route.js");
const requestRouter = require("./routes/request.route.js");
const userRouter = require("./routes/User.routes.js");

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);

const port = 7000;

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
