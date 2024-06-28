const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new mongoose.Schema({
  name: String,
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
});

module.exports = mongoose.model('Team', TeamSchema);

