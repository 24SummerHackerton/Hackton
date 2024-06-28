const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  name: String,
  players: [String],
  game: { type: Schema.Types.ObjectId, ref: 'Game' }
});

module.exports = mongoose.model('Team', teamSchema);
