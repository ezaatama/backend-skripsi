const Units = require("../models/units");
const Buyer = require("../models/buyer");
const Account = require("../models/accounts");
const Proyek = require("../models/proyek");
const TipeProyek = require("../models/tipe_proyek");
const { Sequelize } = require("sequelize");
const { validationResult } = require("express-validator");
const ProgressUnit = require("../models/progress_unit");
const ProgressImage = require("../models/progress_images");

const getAllUnits = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const accountId = req.role;

    if (accountId === "99") {
      const units = await Units.findAndCountAll({
        attributes: ["uuid", "name", "luas_tanah", "price", "status"],
        offset,
        limit,
      });

      const totalItems = units.count;
      const totalPages = Math.ceil(totalItems / limit);

      if (page > totalPages) {
        // Jika halaman yang diminta melebihi total halaman yang ada, kirim respons 204 (No Content).
        return res.status(204).end();
      }

      const response = {
        message: "Data unit berhasil diambil",
        data: units.rows,
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
      res.status(403).json({ message: "Tidak diizinkan melihat data unit!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//mobile
const getListUnits = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const accountId = req.user;

    const units = await Units.findAndCountAll({
      attributes: ["uuid", "name", "status"],
      where: { accountId: accountId },
      offset,
      limit,
      include: [
        {
          model: Proyek,
          attributes: ["name", "logo", "address"],
        },
        {
          model: ProgressUnit,
          attributes: [
            [Sequelize.fn("MAX", Sequelize.col("progress")), "totalProgress"],
          ],
        },
      ],
    });

    const totalItems = units.count;
    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages) {
      // Jika halaman yang diminta melebihi total halaman yang ada, kirim respons 204 (No Content).
      return res.status(204).end();
    }

    const response = {
      message: "Data unit berhasil diambil",
      data: units.rows,
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDetailUnit = async (req, res) => {
  try {
    const accountId = req.user;

    const response = await Units.findOne({
      attributes: ["name"],
      where: {
        accountId: accountId,
        uuid: req.params.uuid || null,
      },
      include: [
        {
          model: Proyek,
          attributes: ["name", "address", "logo"],
        },
        {
          model: TipeProyek,
          attributes: ["spesification"],
        },
      ],
    });

    if (!response)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });

    // Proses spesification
    const spesificationArray = response.tipe_proyek.spesification
      .split(", ")
      .map((item) => {
        const [label, content] = item.split(": ");
        return { label, content };
      });

    res.status(200).json({
      message: "Detail unit berhasil diambil!",
      data: {
        name: response.name,
        proyek: {
          name: response.proyek.name,
          address: response.proyek.address,
        },
        images: response.proyek.logo,
        spesification: spesificationArray,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProgressUnits = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  try {
    const accountId = req.user;

    const response = await Units.findAndCountAll({
      attributes: [],
      offset,
      limit,
      where: {
        accountId: accountId,
        uuid: req.params.uuid || null,
      },
      include: [
        {
          model: ProgressUnit,
          attributes: ["progress", "description", "createdAt"],

          include: [
            {
              model: ProgressImage,
              attributes: ["url"],
            },
          ],
        },
      ],
    });

    if (!response)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });

    const totalItems = response.count;
    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages) {
      // Jika halaman yang diminta melebihi total halaman yang ada, kirim respons 204 (No Content).
      return res.status(204).end();
    }

    if (page > 1) {
      response.meta.prevPage = page - 1;
    }
    if (page < totalPages) {
      response.meta.nextPage = page + 1;
    }

    res.status(200).json({
      message: "Progress unit berhasil diambil!",
      data: response.rows,
      meta: {
        totalItems,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUnitById = async (req, res) => {
  try {
    const accountId = req.role;

    if (accountId === "99") {
      const response = await Units.findOne({
        attributes: ["uuid", "name", "luas_tanah", "price", "status"],
        where: {
          uuid: req.params.uuid || null,
        },
        include: [
          {
            model: Buyer,
            attributes: ["id", "name", "phoneNumber"],
            through: {
              attributes: [],
            },
          },
        ],
      });

      if (!response)
        return res.status(404).json({
          message: "Data tidak ditemukan!",
        });

      res.status(200).json({
        message: "Detail unit berhasil diambil!",
        data: response,
      });
    } else {
      res.status(403).json({ message: "Tidak diizinkan melihat detail unit!" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
      serverMessage: error.message,
    });
  }
};

const createUnit = async (req, res) => {
  const { name, luas_tanah, price, status, tipeProyekId, proyekId, buyer_id } =
    req.body;

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
    const accountId = req.role;

    if (accountId === "99") {
      const unit = await Units.create({
        name: name,
        luas_tanah: luas_tanah,
        price: price,
        status: status,
        tipeProyekId: tipeProyekId,
        proyekId: proyekId,
      });

      if (buyer_id && buyer_id.length > 0) {
        const buyers = await Buyer.findAll({
          where: {
            id: buyer_id,
          },
        });

        if (buyers.length > 0) {
          await unit.addBuyers(buyers);
        } else {
          res.status(404).json({ message: "Pembeli tidak ditemukan" });
          return;
        }
      }

      res.status(201).json({
        message: "Data Unit dan Pembeli berhasil dibuat dan dihubungkan!",
      });
    } else {
      res.status(403).json({ message: "Tidak diizinkan membuat data unit!" });
    }
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
    return res.status(404).json({ message: "Data unit tidak ditemukan!" });

  const { name, id_tipe, id_proyek, luas_tanah, price, status } = req.body;

  try {
    const accountId = req.role;

    if (accountId === "99") {
      await Units.update(
        {
          name: name,
          tipeProyekId: id_tipe,
          proyekId: id_proyek,
          luas_tanah: luas_tanah,
          price: price,
          status: status,
        },
        {
          where: {
            uuid: unit.uuid,
          },
        }
      );
      res.status(200).json({ message: "Data unit berhasil diubah!" });
    } else {
      res.status(403).json({ message: "Tidak diizinkan mengubah data unit!" });
    }
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
    const accountId = req.role;

    if (accountId === "99") {
      await Units.destroy({
        where: {
          uuid: unit.uuid,
        },
      });
      res.status(200).json({ message: "Data unit berhasil dihapus!" });
    } else {
      res.status(403).json({ message: "Tidak diizinkan menghapus data unit!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllUnits,
  getListUnits,
  getDetailUnit,
  getProgressUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
};
