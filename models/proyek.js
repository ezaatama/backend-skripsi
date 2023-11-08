const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");
const TipeProyek = require("./tipe_proyek");
const Units = require("./units");

const Proyek = sequelize.define(
  "proyek",
  {
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price_start_from: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    proyek_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    siteplan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    facilities: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Proyek.hasMany(TipeProyek);
Proyek.hasMany(Units);
Units.belongsTo(Proyek);

module.exports = Proyek;
