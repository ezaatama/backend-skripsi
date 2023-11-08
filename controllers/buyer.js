const Buyer = require("../models/buyer");
const Unit = require("../models/units");
const Account = require("../models/accounts");
const axios = require("axios");
const { validationResult } = require("express-validator");

const getBuyer = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const buyer = await Buyer.findAndCountAll({
      attributes: ["id", "name", "profile_picture", "phoneNumber"],
      offset,
      limit
    });

    const totalItems = buyer.count;
    const totalPages = Math.ceil(totalItems / limit);

    if (page > totalPages) {
      // Jika halaman yang diminta melebihi total halaman yang ada, kirim respons 204 (No Content).
      return res.status(204).end();
    }

    const response = {
      message: "Data buyer berhasil diambil!",
      data: buyer.rows,
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

const getBuyerById = async (req, res) => {
  try {
    const response = await Buyer.findOne({
      attributes: ["id", "name", "profile_picture", "phoneNumber"],
      where: {
        id: req.params.id || null,
      },
      include: [
        {
          model: Unit,
          attributes: [
            "uuid", "name", "luas_tanah", "price"
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
      message: "Detail buyer berhasil diambil!",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createBuyer = async (req, res) => {
  const { accountId, name, phoneNumber, unit_id } = req.body;

  try {
    const account = await Account.findByPk(accountId);

    if (account && account.role === "98") {
      // let profilePictureUrl = req.body.profile_picture;
      let profilePictureUrl = `/public/assets/images/${req.file.filename}`;

      if (!profilePictureUrl) {
        const uiAvatarsResponse = await axios.get(
          `https://ui-avatars.com/api/?name=${name}&size=200`,
          {
            responseType: "arraybuffer",
          }
        );
        const base64 = Buffer.from(uiAvatarsResponse.data, "binary").toString(
          "base64"
        ); // Konversi ke base64
        profilePictureUrl = `data:image/png;base64,${base64}`;
        profilePictureUrl = profilePictureUrl.replace(
          "data:image/png;base64,",
          "https://ui-avatars.com/api/?format=png&name="
        );
      }

      const buyer = await Buyer.create({
        name: name,
        profile_picture: profilePictureUrl,
        accountId: account.id,
        phoneNumber: phoneNumber,
      });

      if (unit_id && unit_id.length > 0) {
        const units = await Unit.findAll({ where: { id: unit_id } });

        if (units.length > 0) {
          // Menghubungkan unit-unit dengan pembeli
          await buyer.addUnits(units);
        } else {
          res.status(404).send('Unit tidak ditemukan.');
          return;
        }
      }

      res.status(201).json({ message: "Data Buyer dan unit berhasil ditambahkan dan dihubungkan!" });
    } else {
      res.status(403).json({ message: "Tidak diizinkan membuat buyer!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const updateBuyer = async (req, res) => {
  const buyer = await Buyer.findOne({
    where: {
      id: req.params.id || null,
    },
  });

  if (!buyer)
    return res.status(404).json({ message: "Data buyer tidak ditemukan!" });

  const { accountId, name, phoneNumber } = req.body;

  try {
    const account = await Account.findByPk(accountId);

    if (account && account.role === "98") {
      let profilePictureUrl = `/public/assets/images/${req.file.filename}`;

      if (!profilePictureUrl) {
        const uiAvatarsResponse = await axios.get(
          `https://ui-avatars.com/api/?name=${name}&size=200`,
          {
            responseType: "arraybuffer",
          }
        );
        const base64 = Buffer.from(uiAvatarsResponse.data, "binary").toString(
          "base64"
        ); // Konversi ke base64
        profilePictureUrl = `data:image/png;base64,${base64}`;
        profilePictureUrl = profilePictureUrl.replace(
          "data:image/png;base64,",
          "https://ui-avatars.com/api/?format=png&name="
        );
      }
      await Buyer.update({
        name: name,
        profile_picture: profilePictureUrl,
        accountId: account.id,
        phoneNumber: phoneNumber,
      },{
        where: {
          id: buyer.id,
        },
      });

      res.status(201).json({ message: "Buyer berhasil diupdate!" });
    } else {
      res.status(403).json({ message: "Tidak diizinkan mengupdate buyer!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBuyer = async (req, res) => {
  const buyer = await Buyer.findOne({
    where: {
      id: req.params.id || null,
    },
  });

  if (!buyer)
    return res.status(404).json({
      message: "Buyer tidak ditemukan!",
    });

  try {
    await Buyer.destroy({
      where: {
        id: buyer.id,
      },
    });
    res.status(200).json({ message: "Data buyer berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createBuyer,
  getBuyer,
  getBuyerById,
  updateBuyer,
  deleteBuyer
};
