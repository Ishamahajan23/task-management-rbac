const mongoose = require("mongoose");

const activityLogSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      userName: {
        type: String,
      },

      userEmail: {
        type: String,
      },

      action: {
        type: String,
        required: true,
      },

      taskId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },

      taskTitle: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "ActivityLog",
  activityLogSchema
);