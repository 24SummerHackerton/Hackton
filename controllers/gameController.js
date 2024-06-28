const Game = require('../models/Game');
const Player = require('../models/Player');
const Bracket = require('../models/Bracket'); // 추가

exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.find({});
    res.json(games);
  } catch (err) {
    console.error('Error fetching games:', err);
    res.status(500).send('Error fetching games.');
  }
};

exports.createGame = async (req, res) => {
  const { name, maxParticipants, rules } = req.body;
  const newGame = new Game({ name, maxParticipants, rules, status: '모집중' });
  try {
    await newGame.save();
    res.redirect('/manage.html');
  } catch (err) {
    console.error('Error creating game:', err);
    res.status(500).send('Error creating game.');
  }
};

exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      res.status(404).send('Game not found.');
    } else {
      res.json(game);
    }
  } catch (err) {
    console.error('Error fetching game details:', err);
    res.status(500).send('Error fetching game details.');
  }
};

exports.addTeamToGame = async (req, res) => {
  const { teamName, players } = req.body;
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      res.status(404).send('Game not found.');
    } else {
      const isFull = game.teams.reduce((count, team) => count + team.players.length, 0) >= game.maxParticipants;
      if (isFull) {
        res.status(400).send('Game is already full.');
      } else {
        const playerData = players.map(player => {
          const [department, studentId, name, phoneNumber] = player.split(',');
          return new Player({ department, studentId, name, phoneNumber });
        });

        game.teams.push({ name: teamName, players: playerData });
        await game.save();
        res.redirect(`/gameDetails.html?id=${game._id}`);
      }
    }
  } catch (err) {
    console.error('Error adding team:', err);
    res.status(500).send('Error adding team.');
  }
};

exports.addTeam = async (req, res) => {
    if (req.isAuthenticated()) {
      const { teamName, players } = req.body;
      try {
        const game = await Game.findById(req.params.id);
        if (!game) {
          res.status(404).send('Game not found.');
        } else {
          game.teams.push({ name: teamName, players: players.split(',').map(player => player.trim()) });
          await game.save();
          res.redirect(`/gameDetails.html?id=${game._id}`);
        }
      } catch (err) {
        console.error('Error adding team:', err);
        res.status(500).send('Error adding team.');
      }
    } else {
      res.redirect('/');
    }
};

exports.updateTeam = async (req, res) => {
    if (req.isAuthenticated()) {
      const { teamId, players } = req.body;
      try {
        const game = await Game.findById(req.params.id);
        if (!game) {
          res.status(404).send('Game not found.');
        } else {
          const team = game.teams.id(teamId);
          if (team) {
            team.players = players.split(',').map(player => player.trim());
            await game.save();
            res.redirect(`/gameDetails.html?id=${game._id}`);
          } else {
            res.status(404).send('Team not found.');
          }
        }
      } catch (err) {
        console.error('Error updating team:', err);
        res.status(500).send('Error updating team.');
      }
    } else {
      res.redirect('/');
    }
};
  

exports.createBracket = async (req, res) => {
    try {
      const game = await Game.findById(req.params.id);
      if (!game) {
        return res.status(404).send('Game not found.');
      }
  
      const teams = game.teams.map(team => team.name);
      if (teams.length < 2) {
        return res.status(400).send('Not enough teams to create a bracket.');
      }
  
      // Shuffle teams and create matches
      for (let i = teams.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [teams[i], teams[j]] = [teams[j], teams[i]];
      }
  
      const matches = [];
      for (let i = 0; i < teams.length; i += 2) {
        if (i + 1 < teams.length) {
          matches.push({ teamA: teams[i], teamB: teams[i + 1], date: new Date() });
        }
      }
  
      const bracket = new Bracket({ game: game._id, matches });
      await bracket.save();
  
      res.status(201).send(bracket);
    } catch (err) {
      console.error('Error creating bracket:', err);
      res.status(500).send('Error creating bracket.');
    }
};

exports.getBrackets = async (req, res) => {
    try {
      const brackets = await Bracket.find().populate('game');
      res.json(brackets);
    } catch (err) {
      console.error('Error fetching brackets:', err);
      res.status(500).send('Error fetching brackets.');
    }
};

exports.updateTeamInGame = async (req, res) => {
  const { teamId, players } = req.body;
  try {
    const game = await Game.findById(req.params.id);
    if (!game) {
      res.status(404).send('Game not found.');
    } else {
      const team = game.teams.id(teamId);
      if (team) {
        const playerData = players.map(player => {
          const [department, studentId, name, phoneNumber] = player.split(',');
          return new Player({ department, studentId, name, phoneNumber });
        });

        team.players = playerData;
        await game.save();
        res.redirect(`/gameDetails.html?id=${game._id}`);
      } else {
        res.status(404).send('Team not found.');
      }
    }
  } catch (err) {
    console.error('Error updating team:', err);
    res.status(500).send('Error updating team.');
  }
};

