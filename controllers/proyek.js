const Proyek = require("../models/proyek");
const TIPE_PROYEK = require("../models/tipe_proyek");
const { Sequelize } = require('sequelize');
const { validationResult } = require("express-validator");

const getAllProyek = async (req, res) => {
  try {
    const response = await Proyek.findAll({
      attributes: [
        "id",
        "slug",
        "name",
        "logo",
        "price_start_from",
        "address",
        "proyek_description",
        "siteplan",
        "facilities",
      ],
      include: [
        {
          model: TIPE_PROYEK,
          attributes:[
            "id", "name"
          ]
        }
      ],
    });

    const responseWithFacilitiesArray = response.map((proyek) => {
      const facilitiesArray = proyek.facilities.split(", ").map((item) => {
        const [label, content] = item.split(": ");
        return { label, content };
      });
      proyek.facilities = facilitiesArray;
      return proyek;
    });

    res.status(200).json({
      message: "Data proyek berhasil diambil",
      data: responseWithFacilitiesArray,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProyek = async (req, res) => {
  const {
    slug,
    name,
    priceStartFrom,
    address,
    proyek_description,
    facilities,
  } = req.body;

  const dataFacilities = facilities.split(", ").map((item) => {
    const [label, content] = item.split(": ");
    return { label, content };
  });

  const facilitiesString = dataFacilities
    .map((item) => `${item.label}: ${item.content}`)
    .join(", ");

  // const domain = "http://localhost:3000";
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error("Input value tidak sesuai");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  try {
    const response = await Proyek.create({
      slug: slug,
      name: name,
      logo: `/public/assets/images/${req.files.logo[0].filename}`,
      // logo: req.files.logo[0].filename,
      price_start_from: priceStartFrom,
      address: address,
      proyek_description: proyek_description,
      siteplan: `/public/assets/document/${req.files.siteplan[0].filename}`,
      // siteplan: req.files.siteplan[0].filename,
      facilities: facilitiesString,
    });

    res.status(201).json({
      message: "Project berhasil dibuat!",
      data: response,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const getProyekById = async (req, res) => {
  try {
    const response = await Proyek.findOne({
      attributes: [
        "id",
        "slug",
        "name",
        "logo",
        "price_start_from",
        "address",
        "proyek_description",
        "siteplan",
        "facilities",
      ],
      where: {
        id: req.params.id || null,
      },
    });

    if (!response)
      return res.status(404).json({
        message: "Data tidak ditemukan!",
      });

    const dataFacilities = response.facilities.split(", ").map((item) => {
      const [label, content] = item.split(": ");
      return { label, content };
    });

    response.facilities = dataFacilities;

    res.status(200).json({
      message: "Detail proyek berhasil diambil!",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
      serverMessage: error.message,
    });
  }
};

const updateProyek = async (req, res) => {
  const proyek = await Proyek.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!proyek)
    return res.status(404).json({ message: "Data proyek tidak ditemukan!" });

  const {
    slug,
    name,
    priceStartFrom,
    address,
    proyek_description,
    facilities,
  } = req.body;

  const dataFacilities = facilities.split(", ").map((item) => {
    const [label, content] = item.split(": ");
    return { label, content };
  });

  const facilitiesString = dataFacilities
    .map((item) => `${item.label}: ${item.content}`)
    .join(", ");

  try {
    await Proyek.update(
      {
        slug: slug,
        name: name,
        logo: `/public/assets/images/${req.files.logo[0].filename}`,
        // logo: req.files.logo[0].filename,
        price_start_from: priceStartFrom,
        address: address,
        proyek_description: proyek_description,
        siteplan: `/public/assets/document/${req.files.siteplan[0].filename}`,
        // siteplan: req.files.siteplan[0].filename,
        facilities: facilitiesString,
      },
      {
        where: {
          id: proyek.id,
        },
      }
    );
    res.status(200).json({ message: "Data Proyek berhasil diubah!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProyek = async (req, res) => {
  const proyek = await Proyek.findOne({
    where: {
      id: req.params.id || null
    }
  });
  if (!proyek)
    return res.status(404).json({
      message: "Proyek tidak ditemukan!",
    });
  try {
    await Proyek.destroy({
      where: {
        id: proyek.id,
      },
    });
    res.status(200).json({ message: "Data proyek berhasil dihapus!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getAllProyek,
  createProyek,
  getProyekById,
  updateProyek,
  deleteProyek
};
