const mongoose = require("mongoose");

const connectToDatabase = async () => {
  await mongoose.connect(
    "mongodb+srv://nijanthan378:TifSquMpMWtbeb0r@devtinder.dnovf.mongodb.net/devTinder"
  );
};

module.exports = { connectToDatabase };
