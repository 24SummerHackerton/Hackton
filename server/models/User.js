const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  profile: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
