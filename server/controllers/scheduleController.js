const Schedule = require('../models/Schedule');

exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate('game teamA teamB referee');
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching schedules' });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const { game, teamA, teamB, date } = req.body;
    const newSchedule = new Schedule({
      game,
      teamA,
      teamB,
      date,
      status: 'upcoming'
    });
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ error: 'Error creating schedule' });
  }
};

exports.getScheduleDetails = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate('game teamA teamB referee');
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching schedule details' });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ error: 'Error updating schedule' });
  }
};
