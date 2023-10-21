const express = require("express");
const { getProgressUnits, getProgressUnitById, createProgressUnit, updateProgressUnit, deleteProgressUnit } = require("../controllers/progress_unit");
const middlewareToken = require("../middleware/verifyToken");
const router = express.Router();

router.get('/progress', middlewareToken, getProgressUnits);
router.get('/progress/:id', middlewareToken, getProgressUnitById);
router.post('/progress', middlewareToken, createProgressUnit);
router.patch('/progress/:id', middlewareToken, updateProgressUnit);
router.delete('/progress/:id', middlewareToken, deleteProgressUnit);

module.exports = router;
