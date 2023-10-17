const Proyek = require("../models/proyek");
const TIPE_PROYEK = require("../models/tipe_proyek");
const { validationResult } = require("express-validator");

const getAllTipeProyek = async (req, res) => {
  try {
    const response = await TIPE_PROYEK.findAll({
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
    });
    const responseWithSpesificationArray = response.map((tpProyek) => {
      const spesificationArray = tpProyek.spesification
        .split(", ")
        .map((item) => {
          const [label, content] = item.split(": ");
          return { label, content };
        });
      tpProyek.spesification = spesificationArray;
      return tpProyek;
    });

    res.status(200).json({
      message: "Data tipe proyek berhasil diambil",
      data: responseWithSpesificationArray,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTipeProyekById = async (req, res) => {
  try {
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

    const dataSpesification = response.spesification.split(", ").map((item) => {
      const [label, content] = item.split(": ");
      return { label, content };
    });

    response.spesification = dataSpesification;

    res.status(200).json({
      message: "Detail tipe proyek berhasil diambil!",
      data: response,
    });
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
    await TIPE_PROYEK.destroy({
      where: {
        id: tipeProyek.id,
      },
    });
    res.status(200).json({ message: "Data tipe proyek berhasil dihapus!" });
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
