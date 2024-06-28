const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  rules: String,
  status: { type: String, enum: ['모집중', '모집완료'], default: '모집중' },
  teams: [{ name: String, players: [String] }]
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;
