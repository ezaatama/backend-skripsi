const express = require("express");
const { me, login, logout } = require("../controllers/auth");
const middlewareToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/me", middlewareToken, me);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
