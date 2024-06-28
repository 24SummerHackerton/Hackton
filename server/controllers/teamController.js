const Team = require('../models/Team');
const Game = require('../models/Game');

exports.getAllTeams = async (req, res) => {
  const teams = await Team.find();
  res.json(teams);
};

exports.createTeam = async (req, res) => {
  const { name, players, gameId } = req.body;
  const newTeam = new Team({ name, players: players.split(',').map(player => player.trim()), game: gameId });
  await newTeam.save();
  
  const game = await Game.findById(gameId);
  game.teams.push(newTeam);
  await game.save();

  res.json(newTeam);
};

exports.getTeamDetails = async (req, res) => {
  const team = await Team.findById(req.params.id).populate('game');
  res.json(team);
};

exports.updateTeam = async (req, res) => {
  const { players } = req.body;
  const team = await Team.findById(req.params.id);
  team.players = players.split(',').map(player => player.trim());
  await team.save();
  res.json(team);
};

exports.deleteTeam = async (req, res) => {
  const team = await Team.findByIdAndDelete(req.params.id);
  const game = await Game.findById(team.game);
  game.teams.pull(team._id);
  await game.save();
  res.json({ message: 'Team deleted' });
};
