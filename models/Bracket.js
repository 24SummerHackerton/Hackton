const mongoose = require('mongoose');

const bracketSchema = new mongoose.Schema({
  game: { type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true },
  matches: [
    {
      teamA: { type: String, required: true },
      teamB: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
});

const Bracket = mongoose.model('Bracket', bracketSchema);

module.exports = Bracket;