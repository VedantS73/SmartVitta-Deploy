const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Video = require('../models/videos')

// import jwt_decode from 'jwt-decode';


router.get('/',(req,res)=>{
    res.send('quotes function')
})


router.post('/savevideo', async (req, res) => {
    try {
        const url = req.body.url
      
  
      // Create a new blog post instance
      const newVideo = new Video({
       videoUrl : url
      });
  
      // Save the blog post to the database
      await newVideo.save();
  
      res.status(200).json({ message: 'Video saved successfully' });
    } catch (error) {
      console.error('Error saving video:', error);
      res.status(500).json({ message: 'Error saving Video' });
    }
  });


  router.get('/getvideos',async (req,res)=>{
    try{
    const videos = await Video.find({});
    res.status(200).json(videos);
    }catch(err){
      console.error('Error saving video:', error);
      res.status(500).json({ message: 'Error fetching Video' });
    }
  })
  
  module.exports = router;