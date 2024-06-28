const Game = require('../models/Game');
const Player = require('../models/Player');
const Bracket = require('../models/Bracket');

// 모든 게임을 가져오는 함수
exports.getAllGames = async (req, res) => {
    try {
      const games = await Game.find({});
      res.json(games);
    } catch (err) {
      console.error('Error fetching games:', err);
      res.status(500).send('Error fetching games.');
    }
};

// 새로운 게임을 생성하는 함수
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

// 특정 게임을 ID로 가져오는 함수
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

// 게임에 팀을 추가하는 함수
exports.addTeam = async (req, res) => {
    if (req.isAuthenticated()) {
      const { teamName, players } = req.body;
      try {
        const game = await Game.findById(req.params.id);
        if (!game) {
          res.status(404).send('Game not found.');
        } else {
          const totalPlayers = game.teams.reduce((count, team) => count + team.players.length, 0);
          const newPlayers = players.split(',').map(player => player.trim());
          if (totalPlayers + newPlayers.length > game.maxParticipants) {
            res.status(400).send('Game is already full.');
          } else {
            game.teams.push({ name: teamName, players: newPlayers });
            await game.save();
            res.redirect(`/gameDetails.html?id=${game._id}`);
          }
        }
      } catch (err) {
        console.error('Error adding team:', err);
        res.status(500).send('Error adding team.');
      }
    } else {
      res.redirect('/');
    }
};

// 게임에 팀을 추가하는 함수
exports.addTeamToGame = async (req, res) => {
    const { teamName, players } = req.body;
    try {
      const game = await Game.findById(req.params.id);
      if (!game) {
        res.status(404).send('Game not found.');
      } else {
        const totalPlayers = game.teams.reduce((count, team) => count + team.players.length, 0);
        const newPlayers = players.split(',').map(player => player.trim());
        if (totalPlayers + newPlayers.length > game.maxParticipants) {
          res.status(400).send('Game is already full.');
        } else {
          game.teams.push({ name: teamName, players: newPlayers });
          await game.save();
          res.redirect(`/gameDetails.html?id=${game._id}`);
        }
      }
    } catch (err) {
      console.error('Error adding team:', err);
      res.status(500).send('Error adding team.');
    }
};

// 팀을 업데이트하는 함수
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

// 브래킷(대진표)을 생성하는 함수
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

        // 브래킷을 생성하는 로직
        const matches = [];
        for (let i = 0; i < teams.length; i += 2) {
            if (i + 1 < teams.length) {
                matches.push({
                    teamA: teams[i].name,
                    teamB: teams[i + 1].name,
                    date: new Date(), // 현재 날짜로 설정
                    gameId: i + 1
                });
            }
        }

        const bracket = new Bracket({
            game: game._id,
            matches: matches
        });

        await bracket.save();

        console.log('Bracket created:', bracket); // 터미널에 브래킷 생성 로그 출력

        res.status(201).send(bracket);
    } catch (err) {
        console.error('Error creating bracket:', err);
        res.status(500).send('Error creating bracket.');
    }
};


// 모든 브래킷을 가져오는 함수
exports.getBrackets = async (req, res) => {
    try {
        const brackets = await Bracket.find().populate('game');
        res.json(brackets);
    } catch (err) {
        console.error('Error fetching brackets:', err);
        res.status(500).send('Error fetching brackets.');
    }
};


// 게임 내 팀을 업데이트하는 함수
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
