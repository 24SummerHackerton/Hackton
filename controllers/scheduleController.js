const Schedule = require('../models/Schedule');

exports.getAllSchedules = async (req, res) => {
  const schedules = await Schedule.find().populate('game teamA teamB referee');
  res.json(schedules);
};

exports.createSchedule = async (req, res) => {
  const { gameId, teamAId, teamBId, date, refereeId } = req.body;
  const newSchedule = new Schedule({ game: gameId, teamA: teamAId, teamB: teamBId, date, referee: refereeId });
  await newSchedule.save();
  res.json(newSchedule);
};

exports.getScheduleDetails = async (req, res) => {
  const schedule = await Schedule.findById(req.params.id).populate('game teamA teamB referee');
  res.json(schedule);
};

exports.updateSchedule = async (req, res) => {
  const { score, result } = req.body;
  const schedule = await Schedule.findById(req.params.id);
  schedule.score = score;
  schedule.result = result;
  await schedule.save();
  res.json(schedule);
};
