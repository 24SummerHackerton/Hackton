const Result = require('../models/Result');

exports.getAllResults = async (req, res) => {
  const results = await Result.find().populate('game schedule teamA teamB referee');
  res.json(results);
};

exports.createResult = async (req, res) => {
  const { gameId, scheduleId, teamAId, teamBId, score, result, refereeId } = req.body;
  const newResult = new Result({ game: gameId, schedule: scheduleId, teamA: teamAId, teamB: teamBId, score, result, referee: refereeId });
  await newResult.save();
  res.json(newResult);
};

exports.getResultDetails = async (req, res) => {
  const result = await Result.findById(req.params.id).populate('game schedule teamA teamB referee');
  res.json(result);
};

exports.updateResult = async (req, res) => {
  const { score, result } = req.body;
  const resultToUpdate = await Result.findById(req.params.id);
  resultToUpdate.score = score;
  resultToUpdate.result = result;
  await resultToUpdate.save();
  res.json(resultToUpdate);
};

exports.deleteResult = async (req, res) => {
  await Result.findByIdAndDelete(req.params.id);
  res.json({ message: 'Result deleted' });
};
