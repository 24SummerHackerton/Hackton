const Bracket = require('../models/Bracket');
const Game = require('../models/Game');
const Team = require('../models/Team');

exports.createBracket = async (req, res) => {
    console.log('createBracket function called');
    try {
      const game = await Game.findById(req.params.id);
      console.log('Game found:', game);
      if (!game) {
        return res.status(404).send('Game not found.');
      }
  
      const teams = game.teams;
      if (teams.length < 2) {
        return res.status(400).send('Not enough teams to create a bracket.');
      }
  
      const bracket = new Bracket({
        game: game._id,
        teams: teams,
        schedule: 'To be scheduled' // 기본 값 설정
      });
  
      await bracket.save();
      console.log('Bracket created:', bracket);
  
      res.status(201).send(bracket);
    } catch (err) {
      console.error('Error creating bracket:', err);
      res.status(500).send('Error creating bracket.');
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
