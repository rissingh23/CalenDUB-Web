const express = require('express');
const Organizer = require('../models/Organizer');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/organizers');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    const events = await Organizer.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', upload.single('picture'), async (req, res) => {
  const { name, description } = req.body;
  const picture = `/uploads/organizers/${req.file.filename}`;
  
  try {
    const newOrg = new Organizer({ name, description, picture });
    await newOrg.save();
    res.status(201).json(newOrg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
