const ActivityLog = require("../models/ActivityLog");
const User = require("../models/User");

const createLog = async (
  userId,
  action,
  taskId = null
) => {
  try {
    const user = await User.findById(
      userId
    ).select("name email");

    await ActivityLog.create({
      userId,
      action,
      taskId,
      userName: user?.name,
      userEmail: user?.email,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = createLog;
