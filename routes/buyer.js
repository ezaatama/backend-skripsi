const express = require("express");
const { getBuyer, getProfile, getBuyerById, createBuyer, updateBuyer, deleteBuyer } = require("../controllers/buyer");
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
  if(file.fieldname === 'profile_picture') {
    (file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg") ? cb(null, true) : cb(null, false);
  }
};

const uploadSingleFile = multer({
  storage: storage,
  fileFilter: filter,
  limits: maxSize,
}).single("profile_picture");

router.get('/buyer', middlewareToken, getBuyer);
router.get('/profile', middlewareToken, getProfile);
router.get('/buyer/:id', middlewareToken, getBuyerById);
router.post('/buyer', middlewareToken, uploadSingleFile, createBuyer);
router.patch('/buyer/:id', middlewareToken, uploadSingleFile, updateBuyer);
router.delete('/buyer/:id', middlewareToken, deleteBuyer);

module.exports = router;
