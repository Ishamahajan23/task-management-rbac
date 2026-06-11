const ActivityLog = require("../models/ActivityLog");

const createLog = async (
  userId,
  action,
  taskId = null
) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      taskId,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = createLog;