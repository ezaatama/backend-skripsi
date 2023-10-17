const express = require("express");
const { createTipeProyek, getAllTipeProyek, getTipeProyekById, updateTipeProyek, deleteTipeProyek } = require("../controllers/tipe_proyek");
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
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const maxSize = 1 * 1024 * 1024;

const filter = (req, file, cb) => {
  if(file.fieldname === 'cover') {
    (file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg") ? cb(null, true) : cb(null, false);
  }
};

const uploadSingleFile = multer({
  storage: storage,
  fileFilter: filter,
  limits: maxSize,
}).single("cover");

router.get('/tipe-proyek', middlewareToken, getAllTipeProyek);
router.get('/tipe-proyek/:id', middlewareToken, getTipeProyekById);
router.post('/tipe-proyek', middlewareToken, uploadSingleFile, createTipeProyek);
router.patch('/tipe-proyek/:id', middlewareToken, uploadSingleFile, updateTipeProyek);
router.delete('/tipe-proyek/:id', middlewareToken, deleteTipeProyek);

module.exports = router;
