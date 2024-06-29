const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  eventName: { type: String, required: true },
  participants: { type: Number, required: true },
  rules: String,
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  status: { type: String, enum: ['모집중', '진행중', '완료'], default: '모집중' }
});

module.exports = mongoose.model('Game', gameSchema);
