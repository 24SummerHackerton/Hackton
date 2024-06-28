const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
  schedule: { type: Schema.Types.ObjectId, ref: 'Schedule' },
  teamA: { type: Schema.Types.ObjectId, ref: 'Team' },
  teamB: { type: Schema.Types.ObjectId, ref: 'Team' },
  score: String,
  result: String, // 승/패/무
  referee: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Result', resultSchema);
