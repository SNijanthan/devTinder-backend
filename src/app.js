const express = require("express");
const app = express();
const { connectToDatabase } = require("./config/Database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // Whitelisting domain name
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/Auth.route.js");
const profileRouter = require("./routes/Profile.route.js");
const requestRouter = require("./routes/request.route");
const userRouter = require("./routes/User.routes");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
