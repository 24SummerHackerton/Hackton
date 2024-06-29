const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
  teamA: { type: Schema.Types.ObjectId, ref: 'Team' },
  teamB: { type: Schema.Types.ObjectId, ref: 'Team' },
  date: Date,
  referee: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['upcoming', 'completed'], default: 'upcoming' },
  scoreA: Number,
  scoreB: Number,
  result: String // 승/패/무
});

module.exports = mongoose.model('Schedule', scheduleSchema);
