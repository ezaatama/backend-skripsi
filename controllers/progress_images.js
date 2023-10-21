const ProgressUnit = require("../models/progress_unit");
const ProgressImage = require("../models/progress_images");
const { validationResult } = require("express-validator");
const { where } = require("sequelize");

const getProgressImages = async (req, res) => {
  try {
    const response = await ProgressImage.findAll();

    const imageArray = response.map((image) => ({
      url: image.url,
    }));

    res.status(200).json({
      message: "Data progress image berhasil diambil!",
      data: imageArray,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProgressImagesById = async (req, res) => {
  try {
    const response = await ProgressImage.findOne({
      attributes: ["url"],
      where: {
        id: req.params.id || null,
      },
    });

    if (!response)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });

    res.status(200).json({
      message: "Detail progress image berhasil diambil!",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createProgressImages = async (req, res) => {
  const { progressUnitId } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Input value tidak sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  //   if (!req.file) {
  //     const err = new Error("Image harus di upload");
  //     err.errorStatus = 400;
  //     throw err;
  //   }

  const progresUnit = await ProgressUnit.findOne({
    where: {
      id: progressUnitId,
    },
  });

  if (!progresUnit)
    return res.status(404).json({ message: "Progress unit tidak ditemukan!" });

  const images = req.files;

  try {
    for (const image of images) {
      await ProgressImage.create({
        progressUnitId: progressUnitId,
        url: `/public/assets/images/${image.filename}`,
      });
    }
    res.status(201).json({
      message: "Progress images berhasil dibuat!",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const updateProgressImage = async (req, res) => {
  const progressImage = await ProgressImage.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!progressImage)
    return res
      .status(404)
      .json({ message: "Data progress image tidak ditemukan!" });

  const { progressUnitId } = req.body;
  const images = req.files;

  try {
    for (const image of images) {
      await ProgressImage.update(
        {
          progressUnitId: progressUnitId,
          url: `/public/assets/images/${image.filename}`
        }, {
          where: {
            id: progressImage.id
          }
        }
      );
    }
    res.status(201).json({
      message: "Progress images berhasil diubah!",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const deleteProgressImage = async (req, res) => {
  const progressImage = await ProgressImage.findOne({
    where: {
      id: req.params.id || null,
    },
  });

  if (!progressImage)
    return res.status(404).json({
      message: "Progress image tidak ditemukan!",
    });

  try {
    await ProgressImage.destroy({
      where: {
        id: progressImage.id,
      },
    });
    res.status(200).json({ message: "Data progress image berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProgressImages,
  getProgressImagesById,
  createProgressImages,
  updateProgressImage,
  deleteProgressImage,
};
