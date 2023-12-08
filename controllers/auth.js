const Accounts = require("../models/accounts");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const user = await Accounts.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "Email tidak terdaftar!",
      });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match)
      return res.status(400).json({
        message: "Password Anda salah!",
      });

    req.session.userId = user.id;
    const userId = user.id;
    const email = user.email;
    const role = user.role;

    const accessToken = jwt.sign(
      {
        userId,
        email,
        role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.EXPIRES_IN,
      }
    );
    if (role === "99" || role === "1") {
      res.setHeader("X-Access-Token", accessToken);
      res.status(200).json({
        message: "Anda berhasil login!",
        data: { expiresIn: process.env.EXPIRES_IN },
      });
    } else {
      res.status(403).json({
        message: "Anda dilarang mengakses halaman ini!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginM = async (req, res) => {
  try {
    const user = await Accounts.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "Email tidak terdaftar!",
      });
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match)
      return res.status(400).json({
        message: "Password Anda salah!",
      });

    req.session.userId = user.id;
    const userId = user.id;
    const email = user.email;
    const role = user.role;

    const accessToken = jwt.sign(
      {
        userId,
        email,
        role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.EXPIRES_IN,
      }
    );
    if (role === "98") {
      res.setHeader("X-Access-Token", accessToken);
      res.status(200).json({
        message: "Anda berhasil login!",
        data: { expiresIn: process.env.EXPIRES_IN },
      });
    } else {
      res.status(403).json({
        message: "Anda dilarang mengakses halaman ini!",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Sesi Anda telah habis!" });
  }
  const user = await Accounts.findOne({
    attributes: ["id", "uuid", "name", "email", "role"],
    where: {
      id: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ message: "Akun tidak ditemukan!" });
  res.status(200).json({
    message: "Data status berhasil diambil",
    data: user,
  });
};

const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) return res.status(400).json({ message: "Tidak dapat logout!" });
      res.removeHeader("X-Access-Token");
      res.json({
        message: "Anda berhasil logout!",
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
      serverMessage: error.message,
    });
  }
};

module.exports = {
  login,
  loginM,
  me,
  logout,
};
