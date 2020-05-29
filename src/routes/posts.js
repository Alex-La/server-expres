const Router = require("express").Router;

const postRoutes = Router();

const Post = require("../db/models/post").default;

postRoutes.get("/all", async (req, res) => {
  try {
    let posts = await Post.findAll();

    if (!posts) {
      res.statusCode = 400;
      return res.end("No posts found");
    }

    posts = posts.map((post) => post.toJSON());

    res.statusCode = 200;
    return res.json({
      posts: {
        posts,
      },
    });
  } catch (e) {
    res.status(500).end("Server error");
  }
});

postRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const post = await Post.findByPk(id);

      if (!post) {
        res.statusCode = 404;
        return res.end(`Post with id: ${id} not found`);
      }

      res.statusCode = 200;
      return res.json({
        post: post.toJSON(),
      });
    } else {
      res.statusCode = 400;
      return res.end("ID is required");
    }
  } catch (e) {
    res.status(500).end("Server error");
  }
});

postRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.statusCode = 400;
      return res.end("ID is required");
    }

    const { title, content } = req.body;

    if (!title && !content) {
      res.statusCode = 401;
      res.end("Body is required");
    }

    await Post.update({ title, content }, { where: { id } });
    const post = Post.findByPk(id);

    if (!post) {
      res.statusCode = 404;
      return res.end("Post was not found");
    }

    res.statusCode = 200;
    return res.json({
      updatedPost: {
        ...post.toJSON(),
      },
    });
  } catch (e) {
    res.status(500).end("Server error");
  }
});

postRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.statusCode = 400;
      return res.end("ID is required");
    }

    const post = await Post.findByPk(id);

    if (!post) {
      res.statusCode = 404;
      return res.end(`Post with id: ${id} was not found`);
    }

    await Post.destroy({ where: { id } });

    res.statusCode = 200;
    return res.json({
      deletedPost: post.toJSON(),
    });
  } catch (e) {
    res.status(500).end("Server error");
  }
});

postRoutes.post("/createComment/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { content } = req.body;

    if (!id) {
      res.statusCode = 400;
      return res.end("ID is required");
    }

    if (!content) {
      res.statusCode = 401;
      res.end("Body is required");
    }

    const post = await Post.findByPk(id);

    if (!post) {
      res.statusCode = 404;
      return res.end(`Post with id: ${id} was not found`);
    }

    await post.createComment({ content });

    let comments = await post.getComments();
    comments = comments.map((comment) => comment.toJSON());

    res.statusCode = 200;
    return res.json({
      post: {
        ...post.toJSON(),
        comments,
      },
    });
  } catch (e) {
    res.status(500).end("Server error");
  }
});

postRoutes.get("/findComments/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.statusCode = 400;
      return res.end("ID is required");
    }

    const post = await Post.findByPk(id);

    if (!post) {
      res.statusCode = 404;
      return res.end(`Post with id: ${id} was not found`);
    }

    let comments = await user.getComments();
    comments = comments.map((comment) => comment.toJSON());

    res.statusCode = 200;
    return res.json({
      postComments: {
        comments,
      },
    });
  } catch (e) {
    res.status(500).end("Server error");
  }
});

module.exports = postRoutes;
