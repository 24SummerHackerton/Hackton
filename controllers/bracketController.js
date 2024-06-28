const Bracket = require('../models/Bracket');
const Game = require('../models/Game');
const Team = require('../models/Team');

exports.createBracket = async (req, res) => {
  try {
    const game = await Game.findById(req.params.gameId).populate('teams');
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const teams = game.teams.map(team => team._id);
    const newBracket = new Bracket({
      gameId: game._id,
      teams: teams,
      schedule: req.body.schedule || '',
    });ㅁ

    await newBracket.save();
    res.status(201).json(newBracket);
  } catch (err) {
    console.error('Error creating bracket:', err);
    res.status(500).json({ error: 'Error creating bracket' });
  }
};

exports.getBrackets = async (req, res) => {
    try {
      const brackets = await Bracket.find({}).populate('teams');
      res.json(brackets);
    } catch (err) {
      console.error('Error fetching brackets:', err);
      res.status(500).json({ error: 'Error fetching brackets' });
    }
  };
