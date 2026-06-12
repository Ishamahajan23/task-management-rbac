const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");

const createLog = async (
  userId,
  action,
  taskId = null,
  taskTitle = null
) => {
  try {
    const user = await User.findById(
      userId
    ).select("name email");

    await ActivityLog.create({
      userId,
      action,
      taskId,
      taskTitle,
      userName: user?.name,
      userEmail: user?.email,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = createLog;
