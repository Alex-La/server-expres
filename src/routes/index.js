const postRoutes = require("./posts");
const userRoutes = require("./users");
const commentRoutes = require("./comments");
const authRoutes = require("./auth");

module.exports = (app) => {
  app.use("/posts", postRoutes);
  app.use("/users", userRoutes);
  app.use("/comments", commentRoutes);
  app.use("/auth", authRoutes);
};
