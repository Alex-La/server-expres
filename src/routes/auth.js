const Router = require("express").Router;
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../db/models/user").default;

const authRoutes = Router();

authRoutes.post(
  "/registration",
  [
    check("name", "Is empty").not().isEmpty(),
    check("email", "Wrong email").isEmail(),
    check("password", "Min password length is 6 symbols").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.statusCode = 400;
        return res.json({
          errors: errors.array(),
          message: "Incorrect registration data",
        });
      }

      const { name, email, password } = req.body;

      const existingUser = await User.findOne({
        where: { email: email },
        raw: true,
      });

      if (existingUser) {
        res.statusCode = 302;
        return res.end("User already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const createdUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      if (!createdUser) {
        res.statusCode = 401;
        return res.end("Cannot create a user");
      }

      res.statusCode = 200;
      return res.json({
        user: {
          ...createdUser.toJSON(),
        },
      });
    } catch (e) {
      console.log(e);
      res.status(500).end("Server error");
    }
  }
);

authRoutes.post(
  "/login",
  [
    check("email", "Inccorect email").isEmail(),
    check("password", "Insert password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.statusCode = 400;
        return res.json({
          errors: errors.array(),
          message: "Incorrect login data",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        res.statusCode = 401;
        return res.end("User not found");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.statusCode = 402;
        return res.end("Wrong password, try again");
      }

      const token = jwt.sign(
        {
          userId: user.id,
        },
        "secretTok",
        { expiresIn: "1h" }
      );

      res.statusCode = 200;
      return res.json({ token, userId: user.id });
    } catch (e) {
      res.status(500).end("Server error");
    }
  }
);

module.exports = authRoutes;
