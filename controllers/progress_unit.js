const ProgressUnit = require("../models/progress_unit");
const ProgressImage = require("../models/progress_images");
const Units = require("../models/units");
const { validationResult } = require("express-validator");

const getProgressUnits = async (req, res) => {
    try {
        const response = await ProgressUnit.findAll({
            attributes: [ "progress", "description" ],
            include: [
              {
                model: ProgressImage,
                attributes:[
                  "url"
                ]
              }
            ],
        });
        res.status(200).json({
            message: "Progress unit berhasil diambil!",
            data: response
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getProgressUnitById = async (req, res) => {
    try {
        const response = await ProgressUnit.findOne({
          attributes: [
            "progress",
            "description",
          ],
          where: {
            id: req.params.id || null
          }
        });
    
        if (!response)
          return res.status(404).json({
            message: "Data tidak ditemukan!",
          });
    
        res.status(200).json({
          message: "Detail progress unit berhasil diambil!",
          data: response,
        });
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
}

const createProgressUnit = async (req, res) => {
    const {
        percentage,
        description,
        unitId
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty) {
      const err = new Error("Input value tidak sesuai");
      err.errorStatus = 400;
      err.data = errors.array();
      throw err;
    }

    const unit = await Units.findByPk(unitId);
  
    if (!unit)
      return res.status(404).json({ message: "Unit tidak ditemukan!" });

      try {
        await ProgressUnit.create({
            unitId: unitId,
            progress: percentage,
            description: description
        });
    
        res.status(201).json({
          message: "Progress unit berhasil dibuat!",
        });
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
}

const updateProgressUnit = async (req, res) => {
    const progress = await ProgressUnit.findOne({
      where: {
        id: req.params.id,
      },
    });
  
    if (!progress)
      return res
        .status(404)
        .json({ message: "Data progress unit tidak ditemukan!" });
  
    const {
        percentage,
        description,
        unitId
    } = req.body;
  
    try {
      await ProgressUnit.update(
        {
            unitId: unitId,
            progress: percentage,
            description: description
        },
        {
          where: {
            id: progress.id,
          },
        }
      );
      res.status(200).json({ message: "Data progress unit berhasil diubah!" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  const deleteProgressUnit = async (req, res) => {
    const progress = await ProgressUnit.findOne({
        where: {
          id: req.params.id || null,
        },
      });
    
      if (!progress)
        return res.status(404).json({
          message: "Progress unit tidak ditemukan!",
        });
    
      try {
        await ProgressUnit.destroy({
          where: {
            id: progress.id,
          },
        });
        res.status(200).json({ message: "Data progress unit berhasil dihapus!" });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
  }
  

module.exports = {
    getProgressUnits,
    getProgressUnitById,
    createProgressUnit,
    updateProgressUnit,
    deleteProgressUnit
}