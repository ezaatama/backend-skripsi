const { DataTypes } = require("sequelize");
const sequelize = require("../config/databases");
const ProgressUnit = require("./progress_unit");
const Account = require("./accounts");
const ProgressImage = require("./progress_images");

const Units = sequelize.define(
  "units",
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
        allowNull: false
    },
    luas_tanah: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("1", "0"),
        allowNull: false
    }
  },
  {
    freezeTableName: true,
  }
);

Units.hasMany(ProgressUnit);
Units.hasMany(ProgressImage);
Units.belongsTo(Account);

module.exports = Units;
