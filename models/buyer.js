const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");

const Buyer = sequelize.define(
  "buyer",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    profile_picture: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Buyer;
