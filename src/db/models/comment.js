const { Model, DataTypes } = require("sequelize");
const uuid = require("uuid");

class Comment extends Model {}

exports.initComment = (sequelize) => {
  Comment.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: () => uuid.v1(),
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      content: DataTypes.STRING,
    },
    { sequelize, modelName: "comment" }
  );
};

exports.default = Comment;
