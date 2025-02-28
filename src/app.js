const express = require("express");

const server = express();

const port = 3000;

server.use("/", (req, res) => {
  res.send("This is initial page");
});

server.use("/page", (req, res) => {
  console.log("Server created using Express");
  res.send("Welcome to this website");
});

server.use("/profile", (req, res) => {
  res.send("Welcome to the Profile page");
});

server.listen(port, () => {
  console.log(`Welcome to the server ${port}`);
});
