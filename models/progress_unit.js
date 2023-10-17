const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");
const ProgressImage = require("./progress_images");

const ProgressUnit = sequelize.define(
  "progress_unit",
  {
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  },
  {
    freezeTableName: true,
  }
);

ProgressUnit.hasMany(ProgressImage);


module.exports = ProgressUnit;
