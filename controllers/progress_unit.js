const ProgressUnit = require("../models/progress_unit");
const ProgressImage = require("../models/progress_images");
const Units = require("../models/units");
const { validationResult } = require("express-validator");

const getProgressUnits = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const accountId = req.role;

    if (accountId === "99") {
      const progressUnit = await ProgressUnit.findAndCountAll({
        attributes: ["id", "progress", "description"],
        limit,
        offset,
        include: [
          {
            model: ProgressImage,
            attributes: ["url"],
          },
        ],
      });

      const totalItems = progressUnit.count;
      const totalPages = Math.ceil(totalItems / limit);

      if (page > totalPages) {
        // Jika halaman yang diminta melebihi total halaman yang ada, kirim respons 204 (No Content).
        return res.status(204).end();
      }

      const response = {
        message: "Progress unit berhasil diambil!",
        data: progressUnit.rows,
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
        .json({ message: "Tidak diizinkan melihat data progress unit!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProgressUnitById = async (req, res) => {
  try {
    const accountId = req.role;

    if (accountId === "99") {
      const response = await ProgressUnit.findOne({
        attributes: ["id", "progress", "description"],
        where: {
          id: req.params.id || null,
        },
      });

      if (!response)
        return res.status(404).json({
          message: "Data tidak ditemukan!",
        });

      res.status(200).json({
        message: "Detail progress unit berhasil diambil!",
        data: response,
      });
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan melihat detail progress unit!" });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createProgressUnit = async (req, res) => {
  const { percentage, description, unitId } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty) {
    const err = new Error("Input value tidak sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const unit = await Units.findByPk(unitId);

  if (!unit) return res.status(404).json({ message: "Unit tidak ditemukan!" });

  if (percentage > 100)
    return res
      .status(400)
      .json({ message: "Percentage lebih dari nilai maximal 100!" });

  try {
    const accountId = req.role;

    if (accountId === "99") {
      await ProgressUnit.create({
        unitId: unitId,
        progress: percentage,
        description: description,
      });

      res.status(201).json({
        message: "Progress unit berhasil dibuat!",
      });
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan membuat data progress unit!" });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProgressUnit = async (req, res) => {
  const progress = await ProgressUnit.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!progress)
    return res
      .status(404)
      .json({ message: "Data progress unit tidak ditemukan!" });

  const { percentage, description, unitId } = req.body;

  try {
    const accountId = req.role;

    if (accountId === "99") {
      await ProgressUnit.update(
        {
          unitId: unitId,
          progress: percentage,
          description: description,
        },
        {
          where: {
            id: progress.id,
          },
        }
      );
      res.status(200).json({ message: "Data progress unit berhasil diubah!" });
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan mengubah data progress unit!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProgressUnit = async (req, res) => {
  const progress = await ProgressUnit.findOne({
    where: {
      id: req.params.id || null,
    },
  });

  if (!progress)
    return res.status(404).json({
      message: "Progress unit tidak ditemukan!",
    });

  try {
    const accountId = req.role;

    if (accountId === "99") {
      await ProgressUnit.destroy({
        where: {
          id: progress.id,
        },
      });
      res.status(200).json({ message: "Data progress unit berhasil dihapus!" });
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan menghapus data progress unit!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProgressUnits,
  getProgressUnitById,
  createProgressUnit,
  updateProgressUnit,
  deleteProgressUnit,
};
