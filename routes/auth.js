const router = require('express').Router();
const { mongoose } = require('mongoose');
const User = require('../model/User');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const { registerValidation } = require('../validation');
const { loginValidation } = require('../validation');

// Register
router.post('/register', async (req, res) => {
  // Validate response before we make a user
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if user already in DB
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send('Email already exists!');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  // Create user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
    date: req.body.date,
  });

  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400);
    res.send(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  // Validate response before we make a user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user already in DB
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email is not found');

  // Check pass (if its is correct)
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send('Invalid password');
  }

  // Create and assign token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token);
  res.send(token);
});

module.exports = router;
