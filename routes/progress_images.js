const express = require("express");
const { getProgressImages, getProgressImagesById, createProgressImages, updateProgressImage, deleteProgressImage } = require("../controllers/progress_images");
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

const filter = (req, file, cb) => {
  if(file.fieldname === 'url') {
    (file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg") ? cb(null, true) : cb(null, false);
  }
};

const uploadArrayFile = multer({
  storage: storage,
  fileFilter: filter,
}).array("url", 5);

router.get('/progress-image', middlewareToken, getProgressImages);
router.get('/progress-image/:id', middlewareToken, getProgressImagesById);
router.post('/progress-image', middlewareToken, uploadArrayFile, createProgressImages);
router.patch('/progress-image/:id', middlewareToken, uploadArrayFile, updateProgressImage);
router.delete('/progress-image/:id', middlewareToken, deleteProgressImage);

module.exports = router;
