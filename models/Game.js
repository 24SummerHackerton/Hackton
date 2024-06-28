const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: String,
  maxParticipants: Number,
  rules: String,
  status: String,
  teams: [{
    name: String,
    players: [String]
  }],
  schedules: [{
    round: String,
    teamA: String,
    teamB: String,
    date: String,
    uniqueId: String
  }]
});

module.exports = mongoose.model('Game', GameSchema);
