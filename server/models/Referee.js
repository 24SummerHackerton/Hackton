const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refereeSchema = new Schema({
  name: String,
  major: String,
  studentId: String,
  phone: String,
  assignedTeam: String
});

module.exports = mongoose.model('Referee', refereeSchema);
