const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");
const Buyer = require("./buyer");
const Unit = require("./units");

const BuyerHasUnit = sequelize.define("buyer_has_units", {});

Unit.belongsToMany(Buyer, {through: BuyerHasUnit});
Buyer.belongsToMany(Unit, {through: BuyerHasUnit});

module.exports = BuyerHasUnit;
