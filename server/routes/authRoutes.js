const express = require("express");
const router = express.Router();
const { registerController, loginController, authCheck, logOut } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerController);

router.post("/login", loginController);
router.post("/logout", logOut);

router.get("/check", authMiddleware, authCheck);

module.exports = router;