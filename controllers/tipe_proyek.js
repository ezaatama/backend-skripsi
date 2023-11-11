const Proyek = require("../models/proyek");
const TIPE_PROYEK = require("../models/tipe_proyek");
const { validationResult } = require("express-validator");

const getAllTipeProyek = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const accountId = req.role;

    if (accountId === "99") {
      const tipeProyek = await TIPE_PROYEK.findAndCountAll({
        attributes: [
          "id",
          "name",
          "bath_room",
          "bed_room",
          "carport",
          "luas_bangunan",
          "cover",
          "spesification",
          "proyekId",
        ],
        limit,
        offset,
      });

      const responseWithSpesificationArray = tipeProyek.rows.map((tpProyek) => {
        const spesificationArray = tpProyek.spesification
          .split(", ")
          .map((item) => {
            const [label, content] = item.split(": ");
            return { label, content };
          });
        tpProyek.spesification = spesificationArray;
        return tpProyek;
      });

      const totalItems = tipeProyek.count;
      const totalPages = Math.ceil(totalItems / limit);

      if (page > totalPages) {
        // Jika halaman yang diminta melebihi total halaman yang ada, kirim respons 204 (No Content).
        return res.status(204).end();
      }

      const response = {
        message: "Data tipe proyek berhasil diambil",
        data: responseWithSpesificationArray,
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
        .json({ message: "Tidak diizinkan melihat data tipe proyek!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTipeProyekById = async (req, res) => {
  try {
    const accountId = req.role;

    if (accountId === "99") {
      const response = await TIPE_PROYEK.findOne({
        attributes: [
          "id",
          "name",
          "bath_room",
          "bed_room",
          "carport",
          "luas_bangunan",
          "cover",
          "spesification",
          "proyekId",
        ],
        where: {
          id: req.params.id || null,
        },
      });

      if (!response)
        return res.status(404).json({
          message: "Data tidak ditemukan!",
        });

      const dataSpesification = response.spesification
        .split(", ")
        .map((item) => {
          const [label, content] = item.split(": ");
          return { label, content };
        });

      response.spesification = dataSpesification;

      res.status(200).json({
        message: "Detail tipe proyek berhasil diambil!",
        data: response,
      });
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan melihat detail data proyek!" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
      serverMessage: error.message,
    });
  }
};

const createTipeProyek = async (req, res) => {
  const {
    name,
    floor,
    bathRoom,
    bedRoom,
    carport,
    luasBangunan,
    spesification,
    proyekId,
  } = req.body;

  const dataSpesification = spesification.split(", ").map((item) => {
    const [label, content] = item.split(": ");
    return { label, content };
  });

  const spesificationString = dataSpesification
    .map((item) => `${item.label}: ${item.content}`)
    .join(", ");

  const errors = validationResult(req);

  if (!errors.isEmpty) {
    const err = new Error("Input value tidak sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Cover harus di upload");
    err.errorStatus = 400;
    throw err;
  }

  const proyek = await Proyek.findOne({
    where: {
      id: proyekId,
    },
  });

  if (!proyek)
    return res.status(404).json({ message: "Proyek tidak ditemukan!" });

  try {
    const accountId = req.role;

    if (accountId === "99") {
      const response = await TIPE_PROYEK.create({
        name: name,
        floor: floor,
        bath_room: bathRoom,
        bed_room: bedRoom,
        carport: carport,
        luas_bangunan: luasBangunan,
        cover: `/public/assets/images/${req.file.filename}`,
        spesification: spesificationString,
        proyekId: proyekId,
      });

      res.status(201).json({
        message: "Tipe Project berhasil dibuat!",
        data: response,
      });
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan membuat data tipe proyek!" });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateTipeProyek = async (req, res) => {
  const tipeProyek = await TIPE_PROYEK.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!tipeProyek)
    return res
      .status(404)
      .json({ message: "Data tipe proyek tidak ditemukan!" });

  const {
    name,
    floor,
    bathRoom,
    bedRoom,
    carport,
    luasBangunan,
    spesification,
    proyekId,
  } = req.body;

  const dataSpesification = spesification.split(", ").map((item) => {
    const [label, content] = item.split(": ");
    return { label, content };
  });

  const spesificationString = dataSpesification
    .map((item) => `${item.label}: ${item.content}`)
    .join(", ");

  try {
    const accountId = req.role;

    if (accountId === "99") {
      await TIPE_PROYEK.update(
        {
          name: name,
          floor: floor,
          bath_room: bathRoom,
          bed_room: bedRoom,
          carport: carport,
          luas_bangunan: luasBangunan,
          cover: `/public/assets/images/${req.file.filename}`,
          spesification: spesificationString,
          proyekId: proyekId,
        },
        {
          where: {
            id: tipeProyek.id,
          },
        }
      );
      res.status(200).json({ message: "Data Tipe Proyek berhasil diubah!" });
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan mengubah data tipe proyek!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTipeProyek = async (req, res) => {
  const tipeProyek = await TIPE_PROYEK.findOne({
    where: {
      id: req.params.id || null,
    },
  });

  if (!tipeProyek)
    return res.status(404).json({
      message: "Tipe proyek tidak ditemukan!",
    });

  try {
    const accountId = req.role;

    if (accountId === "99") {
      await TIPE_PROYEK.destroy({
        where: {
          id: tipeProyek.id,
        },
      });
      res.status(200).json({ message: "Data tipe proyek berhasil dihapus!" });
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan menghapus data tipe proyek!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTipeProyek,
  getAllTipeProyek,
  getTipeProyekById,
  updateTipeProyek,
  deleteTipeProyek,
};
