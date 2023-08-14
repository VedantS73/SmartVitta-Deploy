const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;