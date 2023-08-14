const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const Blog = require('../models/blogs')
const jwt_decode = require('jwt-decode')

// import jwt_decode from 'jwt-decode';


router.get('/',(req,res)=>{
    res.send('Blogs function')
})

router.get('/recentblogs', async (req, res) => {
  try {
    const recentBlogs = await Blog.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(10); // Limit to the last 10 posts

    res.json(recentBlogs);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post('/saveblog', async (req, res) => {
    try {
        const content = req.body.content
        const url = req.body.url
      
  
      // Create a new blog post instance
      const newBlog = new Blog({
        title : content,
        url : url ,
        author : "ADMIN"
      });
  
      // Save the blog post to the database
      await newBlog.save();
  
      res.status(200).json({ message: 'Blog post saved successfully' });
    } catch (error) {
      console.error('Error saving blog:', error);
      res.status(500).json({ message: 'Error saving blog post' });
    }
  });

module.exports = router