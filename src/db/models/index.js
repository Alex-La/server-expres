const { initUser, default: User } = require("./user");
const { initPost, default: Post } = require("./post");
const { initComment, default: Comment } = require("./comment");

const initRelation = () => {
  User.hasMany(Post, { foreignKey: "userId", onDelete: "CASCADE" });
  Post.belongsTo(User);
  Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });
  Comment.belongsTo(Post);
};

module.exports = (sequelize) => {
  initUser(sequelize);
  initPost(sequelize);
  initComment(sequelize);
  initRelation();
};
