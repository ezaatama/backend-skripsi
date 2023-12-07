const { DataTypes } = require("sequelize");
const Buyer = require("./buyer");
const sequelize = require("../config/databases");

const Accounts = sequelize.define(
  "accounts",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.ENUM("98", "99", "1"),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Accounts.hasOne(Buyer);

Buyer.belongsTo(Accounts);

module.exports = Accounts;
