const Sequelize = require("sequelize");
const initModels = require("./models");

const Op = Sequelize.Op;
const operatorsAliases = {
  $in: Op.in,
};

const db = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: "./store.db",
  operatorsAliases,
  logging: false,
});

initModels(db);
module.exports = db;
