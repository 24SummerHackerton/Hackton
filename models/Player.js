const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  department: String,
  studentId: String,
  name: String,
  phoneNumber: String
});

module.exports = mongoose.model('Player', playerSchema);
