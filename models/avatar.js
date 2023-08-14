const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema({
    username: String,
    data: Buffer,
    contentType: String,
  });

const avatar = mongoose.model('avatar', avatarSchema);
module.exports = avatar;