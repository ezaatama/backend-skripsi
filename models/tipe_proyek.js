const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");
const Units = require("./units");
const Proyek = require("./proyek");

const TipeProyek = sequelize.define(
  "tipe_proyek",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bath_room: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bed_room: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    carport: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    luas_bangunan: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    cover: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    spesification: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

TipeProyek.hasMany(Units);

module.exports = TipeProyek;
