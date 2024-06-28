const Referee = require('../models/Referee');

exports.getAllReferees = async (req, res) => {
  const referees = await Referee.find();
  res.json(referees);
};

exports.getRefereeDetails = async (req, res) => {
  const referee = await Referee.findById(req.params.id).populate('assignedGames');
  res.json(referee);
};

exports.createReferee = async (req, res) => {
  const { name, department, contact } = req.body;
  const newReferee = new Referee({ name, department, contact });
  await newReferee.save();
  res.json(newReferee);
};

exports.updateReferee = async (req, res) => {
  const { name, department, contact } = req.body;
  const referee = await Referee.findById(req.params.id);
  referee.name = name;
  referee.department = department;
  referee.contact = contact;
  await referee.save();
  res.json(referee);
};
