const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Userschema = new schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  panNumber: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{10}$/,
    // The "match" property uses a regular expression to validate that the phone number is in a valid format (10 digits).
  },
  money: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  subscriptionType: {
    type: String,
    default: 'N',
  },
  subscriptionAt: {
    type: Date,
    default: null,
  },
  coursesCompleted: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('user', Userschema);
module.exports = User;
