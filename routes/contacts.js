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
    return res.status(500).send("Server Error");
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

    const { name, email, phone, type, date } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        type,
        date,
        phone,
        user: req.user.id,
      });
      const contact = await newContact.save();
      return res.json({ contact });
    } catch (error) {
      console.error(error.message);
      //return res.status(500).send("Server Error");
      return res.status(500).json({ msg: "Server Error" });
    }
  }
);

/**
 * @route   PUT api/contacts
 * @desc     Update contact
 * @access  Private
 */
router.put("/:id", authMiddleware, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // Build contact object

  const contactFields = {};

  if (name) contactFields.name = name;

  if (email) contactFields.email = email;

  if (phone) contactFields.phone = phone;

  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "Contact not found" });

    // Make sure user owns contact

    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,

      { $set: contactFields },

      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.error(er.message);

    res.status(500).send("Server Error");
  }
});

/**
 * @route   DELETE api/contacts
 * @desc     Delete contact
 * @access  Private
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "Contact not found" });

    // Make sure user owns contact

    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: "Contact removed" });
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
});

module.exports = router;
