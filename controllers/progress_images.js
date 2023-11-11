const ProgressUnit = require("../models/progress_unit");
const ProgressImage = require("../models/progress_images");
const { validationResult } = require("express-validator");
const { where } = require("sequelize");

const getProgressImages = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const accountId = req.role;

    if (accountId === "99") {
      const progressImage = await ProgressImage.findAndCountAll({
        limit,
        offset,
      });

      const imageArray = progressImage.rows.map((image) => ({
        url: image.url,
      }));

      const totalItems = progressImage.count;
      const totalPages = Math.ceil(totalItems / limit);

      if (page > totalPages) {
        // Jika halaman yang diminta melebihi total halaman yang ada, kirim respons 204 (No Content).
        return res.status(204).end();
      }

      const response = {
        message: "Data progress image berhasil diambil!",
        data: imageArray,
        meta: {
          totalItems,
          totalPages,
          currentPage: page,
        },
      };

      if (page > 1) {
        response.meta.prevPage = page - 1;
      }
      if (page < totalPages) {
        response.meta.nextPage = page + 1;
      }

      res.status(200).json(response);
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan melihat data progress image!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProgressImagesById = async (req, res) => {
  try {
    const accountId = req.role;

    if (accountId === "99") {
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
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan melihat detail progress image!" });
    }
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
    const accountId = req.role;

    if (accountId === "99") {
      for (const image of images) {
        await ProgressImage.create({
          progressUnitId: progressUnitId,
          url: `/public/assets/images/${image.filename}`,
        });
      }
      res.status(201).json({
        message: "Progress images berhasil dibuat!",
      });
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan membuat data progress image!" });
    }
  } catch (error) {
    res.status(500).json({
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
    const accountId = req.role;

    if (accountId === "99") {
      for (const image of images) {
        await ProgressImage.update(
          {
            progressUnitId: progressUnitId,
            url: `/public/assets/images/${image.filename}`,
          },
          {
            where: {
              id: progressImage.id,
            },
          }
        );
      }
      res.status(201).json({
        message: "Progress images berhasil diubah!",
      });
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan mengubah data progress image!" });
    }
  } catch (error) {
    res.status(500).json({
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
    const accountId = req.role;

    if (accountId === "99") {
      await ProgressImage.destroy({
        where: {
          id: progressImage.id,
        },
      });
      res
        .status(200)
        .json({ message: "Data progress image berhasil dihapus!" });
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan menghapus data progress image!" });
    }
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
