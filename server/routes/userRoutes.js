const express = require('express');
const User = require('../models/User');
const verifyToken = require("../firebase/verifyToken");
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  const { uid, email } = req.user;
  try {
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, email });
      await user.save();
    }
    res.status(201).json({ message: "User authenticated successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
