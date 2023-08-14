const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer for handling file uploads
const sharp = require('sharp'); 
const Avatar = require('../models/avatar');

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('avatar'), async (req, res) => {
  const { username } = req.body;
  try {
    let avatar = await Avatar.findOne({ username });

    if (!avatar) {
      // If no avatar exists for the username, create a new one
      avatar = new Avatar({
        username: req.body.username,
      });
    }

    // Resize and convert the image to base64
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize({ width: 200, height: 200 }) // Adjust dimensions as needed
      .toBuffer();

    avatar.data = resizedImageBuffer;
    avatar.contentType = req.file.mimetype;

    await avatar.save();
    res.status(201).send('Avatar uploaded and resized successfully');
  } catch (error) {
    res.status(500).send('An error occurred');
  }
});

router.get('/getavatar/:username', async (req, res) => {
    const { username } = req.params;
    try {
      const avatar = await Avatar.findOne({ username });
      if (avatar) {
        res.status(200).json(avatar);
      } else {
        console.log('Avatar not found');
        res.status(404).send('Avatar not found');
      }
    } catch (error) {
      res.status(500).send('An error occurred');
    }
  });

module.exports = router