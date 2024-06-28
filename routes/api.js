const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const Player = require('../models/Player');
const Referee = require('../models/Referee');
const Result = require('../models/Result');
const Schedule = require('../models/Schedule');
const Team = require('../models/Team');
const User = require('../models/User');

router.get('/api/all-data', async (req, res) => {
  try {
    const games = await Game.find({});
    const players = await Player.find({});
    const referees = await Referee.find({});
    const results = await Result.find({});
    const schedules = await Schedule.find({});
    const teams = await Team.find({});
    const users = await User.find({});

    res.json({
      games,
      players,
      referees,
      results,
      schedules,
      teams,
      users
    });
  } catch (error) {
    console.error('Error fetching all data:', error);
    res.status(500).send('Error fetching all data');
  }
});

module.exports = router;
