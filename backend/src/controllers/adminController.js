const User = require("../models/User");
const Task = require("../models/Task");
const createLog = require("../utils/activityLogger");
const ActivityLog = require("../models/ActivityLog");


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "-password"
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserRole = async (
  req,
  res
) => {
  try {
    const { role } = req.body;

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await ActivityLog.updateMany(
      { userId: user._id },
      {
        userName: user.name,
        userEmail: user.email,
      }
    );

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("user", "name email role");

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.deleteOne();
    await createLog(
      req.user._id,
      "DELETE_TASK",
      task._id,
      task.title
    );

    res.status(200).json({
      success: true,
      message:
        "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getactivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("userId", "name email role")
      .populate("taskId", "title status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalTasks = await Task.countDocuments();

    const completedTasks =
      await Task.countDocuments({
        status: "Completed",
      });

    const pendingTasks =
      await Task.countDocuments({
        status: "Pending",
      });

    const activeUsers =
      await User.countDocuments({
        status: "Active",
      });

    res.status(200).json({
      success: true,
      totalUsers,
      activeUsers,
      totalTasks,
      completedTasks,
      pendingTasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getAllTasks,
  deleteTask,
  getactivityLogs,
  getAnalytics,
};

