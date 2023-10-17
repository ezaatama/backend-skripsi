const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

const ProgressImage = sequelize.define(
  "progress_images",
  {
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = ProgressImage;
