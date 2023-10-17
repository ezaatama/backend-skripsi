const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");
const Buyer = require("./buyer");
const Unit = require("./units");

const BuyerHasUnit = sequelize.define("buyer_has_units", {});

BuyerHasUnit.belongsTo(Buyer);
BuyerHasUnit.belongsTo(Unit);
BuyerHasUnit.removeAttribute("id");

module.exports = BuyerHasUnit;
