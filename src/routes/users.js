const Router = require("express").Router;
const bcrypt = require("bcryptjs");
const User = require("../db/models/user").default;

const userRoutes = Router();

userRoutes.get("/all", async (req, res) => {
  try {
    let users = await User.findAll();

    if (!users) {
      res.statusCode = 400;
      return res.end("No users found");
    }

    users = users.map((user) => user.toJSON());

    res.statusCode = 200;
    return res.json({
      users,
    });
  } catch (e) {
    res.status(500).end("Server error");
  }
});

userRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const user = await User.findByPk(id);

      if (!user) {
        res.statusCode = 404;
        return res.end(`User with id: ${id} not found`);
      }

      res.statusCode = 200;
      return res.json({
        user: user.toJSON(),
      });
    } else {
      res.statusCode = 400;
      return res.end("ID is required");
    }
  } catch (e) {
    res.status(500).end("Server error");
  }
});

userRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.statusCode = 400;
      return res.end("ID is required");
    }

    const { name, email, password } = req.body;

    if (!name && !email && !password) {
      res.statusCode = 401;
      res.end("Body is required");
    }

    let hashedPasword;

    if (password.length >= 6) {
      hashedPasword = bcrypt.hash(password, 12);
    }

    await User.update({ name, email, hashedPasword }, { where: { id } });
    const user = User.findByPk(id);

    if (!user) {
      res.statusCode = 404;
      return res.end("User was not found");
    }

    res.statusCode = 200;
    return res.json({
      updatedUser: {
        ...user.toJSON(),
      },
    });
  } catch (e) {
    res.status(500).end("Server error");
  }
});

userRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.statusCode = 400;
      return res.end("ID is required");
    }

    const user = await User.findByPk(id);

    if (!user) {
      res.statusCode = 404;
      return res.end(`User with id: ${id} was not found`);
    }

    await User.destroy({ where: { id } });

    res.statusCode = 200;
    return res.json({
      deletedUser: user.toJSON(),
    });
  } catch (e) {
    res.status(500).end("Server error");
  }
});

userRoutes.post("/createPost/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { title, content } = req.body;

    if (!title || !content) {
      res.statusCode = 400;
      res.end("Body is required");
    }

    if (!id) {
      res.statusCode = 401;
      return res.end("ID is required");
    }

    const user = await User.findByPk(id);

    if (!user) {
      res.statusCode = 404;
      return res.end(`User with id: ${id} was not found`);
    }

    await user.createPost({ title, content });

    let posts = await user.getPosts();
    posts = posts.map((post) => post.toJSON());

    res.statusCode = 200;
    return res.json({
      user: {
        ...user.toJSON(),
        posts,
      },
    });
  } catch (e) {
    res.status(500).end("Server error");
  }
});

userRoutes.get("/findPosts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.statusCode = 400;
      return res.end("ID is required");
    }

    const user = await User.findByPk(id);

    if (!user) {
      res.statusCode = 404;
      return res.end(`User with id: ${id} was not found`);
    }

    let posts = await user.getPosts();
    posts = posts.map((post) => post.toJSON());

    res.statusCode = 200;
    return res.json({
      userPosts: {
        posts,
      },
    });
  } catch (e) {
    res.status(500).end("Server error");
  }
});

module.exports = userRoutes;
