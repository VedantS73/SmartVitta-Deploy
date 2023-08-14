const express = require('express')
const router = express.Router()

const Quote = require('../models/quotes')

// import jwt_decode from 'jwt-decode';

router.get('/',(req,res)=>{
    res.send('Quotes function')
})

router.post('/savequote', async (req, res) => {
    try {
        const quote = req.body.inputQuote
      
  
      // Create a new blog post instance
      const newQuote = new Quote({
        content : quote
      });
  
      // Save the blog post to the database
      await newQuote.save();
  
      res.status(200).json({ message: 'Quote saved successfully' });
    } catch (error) {
      console.error('Error saving Quote:', error);
      res.status(500).json({ message: 'Error saving Quote' });
    }
  });
  
  router.get('/randomquote', async (req, res) => {
    try {
      const count = await Quote.countDocuments();
      const randomIndex = Math.floor(Math.random() * count);
      
      const randomQuote = await Quote.findOne().skip(randomIndex);
      if (!randomQuote) {
        return res.status(404).json({ message: 'No quotes found' });
      }
  
      res.json({ quote: randomQuote.content });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching quote' });
    }
  });

  module.exports = router;