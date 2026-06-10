const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createLog = require("../utils/activityLogger");

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

const sendTokenResponse = (
  user,
  statusCode,
  res,
  message
) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password } =
      req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "User" || role,

      status: "Active",
    });

    sendTokenResponse(
      user,
      201,
      res,
      "Registration successful"
    );
  } catch (error) {
    console.error(
      "Register Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } =
      req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const user =
      await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        success: false,
        message:
          "Account is inactive",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    sendTokenResponse(
      user,
      200,
      res,
      "Login successful"
    );
    await createLog(
    user._id,
    "LOGIN"
    );
  } catch (error) {
    console.error(
      "Login Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(
      "GetMe Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const logout = async (req, res) => {
  try {
    await createLog(
      req.user._id,
      "LOGOUT"
    );
    res.status(200).json({
      success: true,
      message:
        "Logged out successfully",
    });
  } catch (error) {
    console.error(
      "Logout Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};