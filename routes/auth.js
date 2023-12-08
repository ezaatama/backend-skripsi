const express = require("express");
const { me, login, loginM, logout } = require("../controllers/auth");
const middlewareToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/me", middlewareToken, me);
router.post("/login", login);
router.post("/loginM", loginM);
router.post("/logout", logout);

module.exports = router;
