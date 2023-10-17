const express = require("express");
const { createProyek, getAllProyek, getProyekById, updateProyek, deleteProyek } = require("../controllers/proyek");
const middlewareToken = require("../middleware/verifyToken");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, path.join(__dirname,"../public/assets/images/"));
    } else {
      cb(null, path.join(__dirname,"../public/assets/document/"));
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const maxSize = 1 * 1024 * 1024;

const filter = (req, file, cb) => {
  if(file.fieldname === 'logo') {
    (file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg") ? cb(null, true) : cb(null, false);
  } else if (file.fieldname === 'siteplan') {
    (file.mimetype === 'application/pdf') ? cb(null, true) : cb(null, false);
  }
};

const uploadMultipleFile = multer({
  storage: storage,
  fileFilter: filter,
  limits: maxSize,
}).fields([
  { name: "logo", maxCount: 1 },
  { name: "siteplan", maxCount: 1 },
]);

router.get('/proyek', middlewareToken, getAllProyek);
router.get('/proyek/:id', middlewareToken, getProyekById);
router.post('/proyek', middlewareToken, uploadMultipleFile, createProyek);
router.patch('/proyek/:id', middlewareToken, uploadMultipleFile, updateProyek);
router.delete('/proyek/:id', middlewareToken, deleteProyek);

module.exports = router;
