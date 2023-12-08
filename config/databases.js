const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "sandboxg_db_homers",
  "sandboxg_ezaatama",
  "rezaputra13",
  {
    host: "api.sandbox-gethome.my.id",
    dialect: "mysql",
  }
);

// const sequelize = new Sequelize("skripsweet_homers", "root", "", {
//   host: "localhost",
//   dialect: "mysql",
// });

module.exports = sequelize;
