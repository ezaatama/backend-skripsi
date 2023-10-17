const Units = require("../models/units");
const Proyek = require("../models/proyek");
const TipeProyek = require("../models/tipe_proyek");
const { validationResult } = require("express-validator");

const getAllUnits = async (req, res) => {
  try {
    const response = await Units.findAll({
      attributes: ["uuid", "name", "luas_tanah", "price", "status"],
    });

    res.status(200).json({
      message: "Data unit berhasil diambil",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUnit = async (req, res) => {
  const { name, luasTanah, price, status, proyekId, tipeProyekId } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty) {
    const err = new Error("Input value tidak sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const proyek = await Proyek.findByPk(proyekId);

  const tipeProyek = await TipeProyek.findByPk(tipeProyekId);

  console.log(`ini id proyek ${proyekId}`);
  console.log(`ini id tipe proyek ${tipeProyekId}`);
  if (!proyek)
    return res.status(404).json({ message: "Proyek tidak ditemukan!" });

  if (!tipeProyek)
    return res.status(404).json({ message: "Tipe proyek tidak ditemukan!" });

    try {
        const response = await Units.create({
          name: name,
          luas_tanah: luasTanah,
          price: price,
          status: status,
          proyekId: proyekId,
          tipeProyekId: tipeProyekId
        });
    
        res.status(201).json({
          message: "Unit berhasil dibuat!",
          data: response,
        });
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }

};

module.exports = {
  getAllUnits,
  createUnit
};
