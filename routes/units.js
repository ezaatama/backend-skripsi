const express = require("express");
const { getAllUnits, createUnit } = require("../controllers/units");
const middlewareToken = require("../middleware/verifyToken");
const router = express.Router();

router.get('/units', middlewareToken, getAllUnits);
// router.get('/units/:id', middlewareToken, );
router.post('/units', middlewareToken, createUnit);
// router.patch('/units/:id', middlewareToken, );
// router.delete('/units/:id', middlewareToken, );

module.exports = router;
