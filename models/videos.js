const mongoose = require("mongoose");
const schema = mongoose.Schema;

const videoSchema = new mongoose.Schema({
    videoUrl: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

const video = mongoose.model('videomodel', videoSchema);
module.exports = video;