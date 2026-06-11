const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getAllTasks,
  getactivityLogs,
  getAnalytics,
} = require(
  "../controllers/adminController"
);

const protect = require(
  "../middleware/authMiddleware"
);

const adminOnly = require(
  "../middleware/adminMiddleware"
);

router.use(protect);
router.use(adminOnly);

router.get("/users", getAllUsers);

router.patch(
  "/users/:id/status",
  updateUserStatus
);

router.patch(
  "/users/:id/role",
  updateUserRole
);

router.delete(
  "/users/:id",
  deleteUser
);

router.get("/tasks", getAllTasks);
router.get("/activity-logs", getactivityLogs);
router.get("/analytics", getAnalytics);

module.exports = router;