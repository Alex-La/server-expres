const { Model, DataTypes } = require("sequelize");
const uuid = require("uuid");

class User extends Model {}

exports.initUser = (sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid.v1(),
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: DataTypes.STRING,
    },
    { sequelize, modelName: "user" }
  );
};

exports.default = User;
