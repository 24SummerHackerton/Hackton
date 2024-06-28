const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refereeSchema = new Schema({
  name: String,
  department: String,
  contact: String,
  role: { type: String, default: 'referee' },
  assignedGames: [{ type: Schema.Types.ObjectId, ref: 'Schedule' }]
});

module.exports = mongoose.model('Referee', refereeSchema);