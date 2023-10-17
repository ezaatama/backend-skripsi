const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('skripsweet_homers', 'root', '', {
    host: "localhost",
    dialect: "mysql"
})

module.exports = sequelize;