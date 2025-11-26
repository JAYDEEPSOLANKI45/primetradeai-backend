const { registerSchema, loginSchema } = require("../utils/joi");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async function (req, res) {
  try {
    const { username, email, password } = req.body;
    const { value, error } = registerSchema.validate({
      username,
      email,
      password,
    });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });

    return res.status(201).json({
      message: "User created successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

const loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;
    const { value, error } = loginSchema.validate({ email, password });
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user);
    return res.status(200).json({ token, user });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error Occured" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
