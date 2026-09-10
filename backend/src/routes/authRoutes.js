const express = require("express");
const { register, login } = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/test", authMiddleware, (req, res) => {
    res.json({
        message: "Middleware is working",
        user: req.user
    });
});

module.exports = router;