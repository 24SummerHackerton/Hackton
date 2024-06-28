const mongoose = require('mongoose');
const Game = require('../models/Game');
const Bracket = require('../models/Bracket');

exports.createBracket = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).send('Game not found.');
        }

        const teams = game.teams;
        if (teams.length < 2) {
            return res.status(400).send('Not enough teams to create a bracket.');
        }

        // Create matches for the bracket
        const matches = [];
        let gameIdCounter = 1; // Initialize gameID counter
        for (let i = 0; i < teams.length; i += 2) {
            if (i + 1 < teams.length) {
                matches.push({
                    teamA: teams[i].name,
                    teamB: teams[i + 1].name,
                    date: new Date(), // Set the match date to the current date for now
                    gameId: gameIdCounter++ // Assign sequential gameID
                });
            }
        }

        const bracket = new Bracket({
            game: game._id,
            matches: matches
        });

        await bracket.save();

        console.log('Bracket created:', bracket); // Log bracket creation to the terminal

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
