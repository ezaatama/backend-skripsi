const Accounts = require("../models/accounts");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const response = await Accounts.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json({
      message: "Data accounts berhasil diambil",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;

  if (password !== confPassword)
    return res.status(400).json({
      message: "Password dan Konfirmasi password tidak cocok!",
    });
  const salt = bcrypt.genSaltSync();
  const hasPassword = await bcrypt.hash(password, salt);
  try {
    await Accounts.create({
      name: name,
      email: email,
      password: hasPassword,
      role: role,
    });
    res.status(201).json({
      message: "Akun berhasil didaftarkan!",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const response = await Accounts.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.params.uuid,
      },
    });
    res.status(200).json({
      message: "Detail user berhasil diambil!",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
      serverMessage: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const user = await Accounts.findOne({
    where: {
      uuid: req.params.uuid,
    },
  });

  if (!user)
    return res.status(404).json({
      message: "Akun tidak ditemukan!",
    });

  const { name, email, password, confPassword, role } = req.body;
  let hashPassword;
  const salt = bcrypt.genSaltSync();

  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await bcrypt.hash(password, salt);
  }
  if (password !== confPassword)
    return res
      .status(400)
      .json({ message: "Password dan Konfirmasi Password tidak cocok!" });

  try {
    await Accounts.update(
      {
        name: name,
        email: email,
        password: hashPassword,
        role: role,
      },
      {
        where: {
          uuid: user.uuid,
        },
      }
    );
    res.status(200).json({ message: "Data User berhasil diubah!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const user = await Accounts.findOne({
    where: {
      uuid: req.params.uuid || null,
    },
  });
  if (!user)
    return res.status(404).json({
      message: "Akun tidak ditemukan!",
    });
  try {
    await User.destroy({
      where: {
        uuid: user.uuid,
      },
    });
    res.status(200).json({ message: "Data User berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};
