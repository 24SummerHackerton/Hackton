const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, enum: ['admin', 'referee', 'player'], default: 'player' },
  department: String,
  contact: String,
  assignedGames: [{ type: Schema.Types.ObjectId, ref: 'Game' }]
});

module.exports = mongoose.model('User', userSchema);