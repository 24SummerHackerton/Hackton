const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true
  },
  teams: [{
    major: String,
    studentId: String,
    name: String,
    phone: String,
    teamName: String
  }]
});

module.exports = mongoose.model('Event', EventSchema);
