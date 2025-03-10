const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    connectionStatus: {
      type: String,
      enum: {
        values: ["accepted", "rejected", "interested", "ignored"],
        message: "Invalid connection status: {VALUE}",
      },
      required: true,
    },
  },
  { timestamps: true }
);

// * Compound indexing

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// ! Using "pre" middleware
// * Checking if both fromUserId and toUserId is same

connectionRequestSchema.pre("save", function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself !!!");
  }

  next();
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
