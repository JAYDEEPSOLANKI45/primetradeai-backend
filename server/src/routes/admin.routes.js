const express = require('express');
const router = express.Router();
const { getUser, getUsers, createUser , updateUser, deleteUser } = require("../controllers/admin.controller");
const { protect } = require('../middleware/auth');
const superadmin = require('../middleware/superadmin');

router.use(protect);
router.use(superadmin);

router.get("/users/:id", getUser);
router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;