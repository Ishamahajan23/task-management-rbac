const mongoose = require("mongoose");

const activityLogSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
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
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "ActivityLog",
  activityLogSchema
);