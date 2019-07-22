const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const User = require("../models/User");
const Contact = require("../models/Contact");

/**
 * @route   GET api/contacts
 * @desc     Get all users contacts
 * @access  Private
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    return res.json(contacts);
  } catch (error) {
    console.error(error.message);
    return server.status(500).send("Server Error");
  }
});

/**
 * @route   POST api/contacts
 * @desc     Add a new contact
 * @access  Private
 */
router.post(
  "/",
  [
    authMiddleware,
    check("name", "name is required")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, type, date } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        type,
        date,
        user: req.user.id,
      });
      const contact = await newContact.save();
      return res.json({ contact });
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server Error");
    }
  }
);

/**
 * @route   PUT api/contacts
 * @desc     Update contact
 * @access  Private
 */
router.put("/:id", (req, res) => {
  res.send("Update contact");
});

/**
 * @route   DELETE api/contacts
 * @desc     Delete contact
 * @access  Private
 */
router.delete("/:id", (req, res) => {
  res.send("Update contact");
});

module.exports = router;
