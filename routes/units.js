const express = require("express");
const { getAllUnits, getListUnits, getDetailUnit, getProgressUnits, getUnitById, createUnit, updateUnit, deleteUnit } = require("../controllers/units");
const middlewareToken = require("../middleware/verifyToken");
const router = express.Router();

router.get('/units', middlewareToken, getAllUnits);
router.get('/list-unit', middlewareToken, getListUnits);
router.get('/detail-unit/:uuid', middlewareToken, getDetailUnit);
router.get('/progress-unit/:uuid', middlewareToken, getProgressUnits);
router.get('/units/:uuid', middlewareToken, getUnitById);
router.post('/units', middlewareToken, createUnit);
router.patch('/units/:uuid', middlewareToken, updateUnit);
router.delete('/units/:uuid', middlewareToken, deleteUnit);

module.exports = router;
