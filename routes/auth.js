const express = require("express");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrybt = require("bcryptjs");
const config = require("config");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

/**
 * @route   GET api/auth
 * @descc     Get logged in user
 * @access  Private
 */

router.get("/", authMiddleware, async (req, res) => {
  console.log(req);
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json({ user });
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

/**
 * @route   POST api/auth
 * @desc     Auth user & get token
 * @access  Public
 */

router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrybt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
