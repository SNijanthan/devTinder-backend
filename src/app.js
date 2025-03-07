const express = require("express");
const { connectToDatabase } = require("./config/Database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");
const requestRouter = require("./routes/request.route");

const app = express();

const port = 7000;

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
