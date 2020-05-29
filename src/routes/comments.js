const Router = require("express").Router;

const commentRoutes = Router();

const Comments = require("../db/models/comment").default;

commentRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.statusCode = 400;
      return res.end("ID is required");
    }

    const { content } = req.body;

    if (!content) {
      res.statusCode = 401;
      res.end("Body is required");
    }

    await Comment.update({ content }, { where: { id } });
    const comment = Comment.findByPk(id);

    if (!comment) {
      res.statusCode = 404;
      return res.end("Comment was not found");
    }

    res.statusCode = 200;
    return res.json({
      updatedComment: {
        ...comment.toJSON(),
      },
    });
  } catch (e) {
    res.status(500).end("Server error");
  }
});

commentRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.statusCode = 400;
      return res.end("ID is required");
    }

    const comment = await Post.findByPk(id);

    if (!comment) {
      res.statusCode = 404;
      return res.end(`Comment with id: ${id} was not found`);
    }

    await Comment.destroy({ where: { id } });

    res.statusCode = 200;
    return res.json({
      deletedComment: comment.toJSON(),
    });
  } catch (e) {
    res.status(500).end("Server error");
  }
});

module.exports = commentRoutes;
