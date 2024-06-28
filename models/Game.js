// MongoDB 연결

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: String,
  players: [String]
});

const gameSchema = new Schema({
  name: String,
  maxParticipants: Number,
  rules: String,
  status: { type: String, default: '모집중' },
  teams: [teamSchema]
});

module.exports = mongoose.model('Game', gameSchema);
