const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Blogschema = new schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const blogpost = mongoose.model('blogpost', Blogschema);
module.exports = blogpost;
