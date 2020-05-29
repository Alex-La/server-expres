const { Model, DataTypes } = require("sequelize");
const uuid = require("uuid");

class Post extends Model {}

exports.initPost = (sequelize) => {
  Post.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid.v1(),
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      title: DataTypes.STRING,
      content: DataTypes.STRING,
    },
    { sequelize, modelName: "post" }
  );
};

exports.default = Post;
