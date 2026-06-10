const mongoose = require("mongoose");
const User = require("./User");

const taskSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    status: {
      type: String,
      enum: [
        "Pending",
        "Completed",
      ],
      default: "Pending",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Task",
  taskSchema
);