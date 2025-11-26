const { taskSchema } = require("../utils/joi");
const Task = require("../models/Task");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { value, error } = taskSchema.validate({
      title,
      description,
      status: "pending",
    });

    if (error)
      return res.status(401).json({ message: error.details[0].message });

    const task = await Task.create({
      title,
      description,
      createdBy: req.user._id,
      status: "pending",
    });

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { tasks: task._id },
      },
      { new: true }
    );

    return res.status(200).json({ message: "Task added successfully", task });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Error Occurred" });
  }
};

const getTasks = async (req, res) => {
  try {
    if (!req.user || !req.user._id)
      return res.status(401).json({ message: "Not authorized" });

    const userWithTasks = await User.findById(req.user._id).populate({
      path: "tasks",
    });

    return res.status(200).json({ tasks: userWithTasks.tasks });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Error Occurred" });
  }
};

const getTask = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Wrong task Id" });
    const task = await Task.findById(id);
    if (!task) return res.status(400).json({ message: "Wrong task Id" });
    if (
      String(task.createdBy) !== String(req.user._id) &&
      (req.user.role !== "admin" ||
        req.user.role !== "super-admin" ||
        req.user.role !== "super-admin")
    )
      return res.status(403).json({ message: "Forbidden" });
    return res
      .status(200)
      .json({ message: "Here is your requested task", task });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Error Occurred" });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Wrong task Id" });

    const { title, description, status } = req.body;

    const { value, error } = taskSchema.validate({
      title,
      description,
      status,
    });

    if (error)
      return res.status(401).json({ message: error.details[0].message });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (String(task.createdBy) !== String(req.user._id) && 0)
      return res.status(403).json({ message: "Forbidden" });

    const updated = await Task.findByIdAndUpdate(id, {
      title,
      description,
      status,
    }, {new:true});

    return res.status(200).json({ message: "Task updated", task: updated });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Error Occurred" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Wrong task Id" });

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      String(task.createdBy) !== String(req.user._id) &&
      (req.user.role !== "admin" || req.user.role !== "super-admin")
    )
      return res.status(403).json({ message: "Forbidden" });

    await Task.findByIdAndDelete(id);

    await User.findByIdAndUpdate(task.createdBy, {
      $pull: { tasks: task._id },
    });

    return res.status(200).json({ message: "Task deleted" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Error Occurred" });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};
