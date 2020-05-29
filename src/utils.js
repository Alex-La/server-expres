const SQL = require("sequelize");

module.exports.createStore = () => {
  const Op = SQL.Op;
  const operatorsAliases = {
    $in: Op.in,
  };

  const db = new SQL("database", "username", "password", {
    dialect: "sqlite",
    storage: "./store.db",
    operatorsAliases,
    logging: false,
  });

  const users = db.define("user", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    email: SQL.STRING,
    name: SQL.STRING,
    token: SQL.STRING,
  });

  const posts = db.define("post", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    title: SQL.STRING,
    content: SQL.STRING,
  });

  const comments = db.define("comment", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    content: SQL.STRING,
    postId: SQL.INTEGER,
    userId: SQL.INTEGER,
  });

  return { users, posts, comments };
};
