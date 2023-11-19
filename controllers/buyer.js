const Buyer = require("../models/buyer");
const Unit = require("../models/units");
const BuyerHasUnits = require("../models/buyer_has_units");
const Account = require("../models/accounts");
const axios = require("axios");
const { validationResult } = require("express-validator");

const getBuyer = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const accountId = req.role;

    if (accountId === "99") {
      const buyer = await Buyer.findAndCountAll({
        attributes: ["id", "name", "profile_picture", "phoneNumber"],
        offset,
        limit,
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
    } else {
      res.status(403).json({ message: "Tidak diizinkan melihat data buyer!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const accountId = req.user;
    
    const response = await Buyer.findOne({
      attributes: ["name", "profile_picture", "phoneNumber"],
      where: {
        accountId: accountId,
      },
      include: [
        {
          model: Account,
          attributes: ['email']
        }
      ]
    });

    if (!response)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });

    res.status(200).json({
      message: "Data profile berhasil diambil!",
      data: {
        name: response.name,
        email: response.account.email,
        profilePicture: response.profile_picture,
        phoneNumber: response.phoneNumber
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

const getBuyerById = async (req, res) => {
  try {
    const accountId = req.role;

    if (accountId === "99") {
      const response = await Buyer.findOne({
        attributes: ["id", "name", "profile_picture", "phoneNumber"],
        where: {
          id: req.params.id || null,
        },
        include: [
          {
            model: Unit,
            attributes: ["uuid", "name", "luas_tanah", "price"],
            through: {
              BuyerHasUnits,
              attributes: []
            },
          },
        ],
      });

      if (!response)
        return res.status(404).json({
          message: "Data tidak ditemukan!",
        });

      res.status(200).json({
        message: "Detail buyer berhasil diambil!",
        data: response,
      });
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan melihat detail buyer!" });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createBuyer = async (req, res) => {
  const { accountId, name, phoneNumber, unit_id } = req.body;

  try {
    const idAccount = req.role;

    const account = await Account.findByPk(accountId);

    if (!account) {
      res.status(404).json({ message: "Account tidak ditemukan." });
    }

    if (idAccount !== "99") {
      res.status(403).json({ message: "Tidak diizinkan membuat data buyer!" });
    } else {
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
        accountId: accountId,
        phoneNumber: phoneNumber,
      });

      if (unit_id && unit_id.length > 0) {
        const units = await Unit.findAll({ where: { id: unit_id } });

        if (units.length > 0) {
          // Menghubungkan unit-unit dengan pembeli
          await buyer.addUnits(units);
        } else {
          res.status(404).send("Unit tidak ditemukan.");
          return;
        }
      }

      res.status(201).json({
        message: "Data Buyer dan unit berhasil ditambahkan dan dihubungkan!",
      });
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

  const account = await Account.findByPk(accountId);

  if (!account) {
    res.status(404).json({ message: "Account tidak ditemukan." });
  }

  const { accountId, name, phoneNumber } = req.body;

  try {
    const idAccount = req.role;

    if (idAccount === "99") {
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
      await Buyer.update(
        {
          name: name,
          profile_picture: profilePictureUrl,
          accountId: accountId,
          phoneNumber: phoneNumber,
        },
        {
          where: {
            id: buyer.id,
          },
        }
      );

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

  const account = await Account.findByPk(accountId);

  if (!account) {
    res.status(404).json({ message: "Account tidak ditemukan." });
  }

  try {

    const accountId = req.role;

    if (accountId === "99") {

      await Buyer.destroy({
        where: {
          id: buyer.id,
        },
      });
      res.status(200).json({ message: "Data buyer berhasil dihapus!" });
    } else {
      res
        .status(403)
        .json({ message: "Tidak diizinkan menghapus data buyer!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBuyer,
  getBuyer,
  getProfile,
  getBuyerById,
  updateBuyer,
  deleteBuyer,
};
