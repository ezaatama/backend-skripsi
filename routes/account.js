const express = require("express");
const { getUsers, createUser, getUserById, updateUser, deleteUser } = require("../controllers/account");
const middlewareToken = require("../middleware/verifyToken");
const router = express.Router();

router.get('/accounts', middlewareToken, getUsers);
router.get('/accounts/:uuid', middlewareToken, getUserById);
router.post('/accounts', middlewareToken, createUser);
router.patch('/accounts/:uuid', middlewareToken, updateUser);
router.delete('/accounts/:uuid', middlewareToken, deleteUser);

module.exports = router;
