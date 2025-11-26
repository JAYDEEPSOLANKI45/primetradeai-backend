const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { registerSchema } = require("../utils/joi");

const getUsers = async function (req, res) {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    const users = await User.find(filter).select("-password");
    return res.status(200).json({ users });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Error Occurred" });
  }
};

const getUser = async function (req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid user id" });

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Error Occurred" });
  }
};

const createUser = async function (req, res) {
  try {
    const { username, email, password, role } = req.body;
    const { value, error } = registerSchema.validate({
      username,
      email,
      password,
    });

    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(409)
        .json({ message: "User with that email already exists" });

    const user = await User.create({
      username,
      email,
      password,
      role: role || "user",
    });

    return res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Error Occurred" });
  }
};

const updateUser = async function (req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid user id" });

    const allowed = ["username", "email", "role", "password"];

    const updates = {};
    for (const key of allowed) {
      if (typeof req.body[key] !== "undefined") updates[key] = req.body[key];
    }
    let updated;
    if (updates.password) {
      const user = await User.findById(id);
      if (!user) return notFound();
      Object.assign(user, updates);
      await user.save();
    } else {
    updated = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
        context: "query",
      }).select("-password");
    }
    res.status(200).json({ message: "User updated", user:updated });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Error Occurred" });
  }
};

const deleteUser = async function (req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid user id" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User deleted" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Error Occurred" });
  }
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
