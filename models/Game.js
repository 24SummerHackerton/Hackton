const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  name: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  rules: String,
  status: { type: String, default: '모집중' },
  teams: [{
    name: { type: String, required: true },
    players: [{ type: String }]
  }],
  schedules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule'
  }]
});

const Game = mongoose.model('Game', gameSchema);
module.exports = Game;
