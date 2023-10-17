const express = require("express");
const { me, login, logout } = require("../controllers/auth");
const router = express.Router();

router.get('/me', me);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
