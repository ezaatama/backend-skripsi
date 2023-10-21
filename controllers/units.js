const Units = require("../models/units");
const Buyer = require("../models/buyer");
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

const getUnitById = async (req, res) => {
  try {
    const response = await Units.findOne({
      attributes: [
        "uuid",
        "name",
        "luas_tanah",
        "price",
        "status"
      ],
      where: {
        uuid: req.params.uuid || null
      },
      include: [
        {
          model: Buyer,
          attributes: [
            "id", "name", "phoneNumber"
          ],
          through: {
            attributes: []
          }
        }
      ]
    });

    if (!response)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });

    res.status(200).json({
      message: "Detail unit berhasil diambil!",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
      serverMessage: error.message,
    });
  }
}

const createUnit = async (req, res) => {
  const { 
    name, 
    luas_tanah, 
    price, 
    status, 
    tipeProyekId,
    proyekId,
    buyer_id
     } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty) {
    const err = new Error("Input value tidak sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  const proyek = await Proyek.findByPk(proyekId);

  const tipeProyek = await TipeProyek.findByPk(tipeProyekId);

  if (!proyek)
    return res.status(404).json({ message: "Proyek tidak ditemukan!" });

  if (!tipeProyek)
    return res.status(404).json({ message: "Tipe proyek tidak ditemukan!" });

  try {
    const unit = await Units.create({
      name: name,
      luas_tanah: luas_tanah,
      price: price,
      status: status,
      tipeProyekId: tipeProyekId,
      proyekId: proyekId,
    });

    if (buyer_id && buyer_id.length > 0) {
      const buyers = await Buyer.findAll({where: {
        id: buyer_id
      }});

      if (buyers.length > 0) {
        await unit.addBuyers(buyers);
      } else {
        res.status(404).json({message: "Pembeli tidak ditemukan"});
        return;
      }
    }

    res.status(201).json({
      message: "Data Unit dan Pembeli berhasil dibuat dan dihubungkan!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateUnit = async (req, res) => {
  const unit = await Units.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });

  if (!unit)
    return res
      .status(404)
      .json({ message: "Data unit tidak ditemukan!" });

  const {
    name,
    id_tipe,
    id_proyek,
    luas_tanah,
    price,
    status
  } = req.body;

  try {
    await Units.update(
      {
        name: name,
        tipeProyekId: id_tipe,
        proyekId: id_proyek,
        luas_tanah: luas_tanah,
        price: price,
        status: status
      },
      {
        where: {
          uuid: unit.uuid,
        },
      }
    );
    res.status(200).json({ message: "Data unit berhasil diubah!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUnit = async (req, res) => {
  const unit = await Units.findOne({
    where: {
      uuid: req.params.uuid || null,
    },
  });

  if (!unit)
    return res.status(404).json({
      message: "Unit tidak ditemukan!",
    });

  try {
    await Units.destroy({
      where: {
        uuid: unit.uuid,
      },
    });
    res.status(200).json({ message: "Data unit berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit
};
