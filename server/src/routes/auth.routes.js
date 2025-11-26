const router = require("express").Router();
const { loginUser , registerUser} = require("../controllers/auth.controllers");

router.get("/",(req,res)=>{res.send("ea")})
router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
