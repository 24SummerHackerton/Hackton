const Referee = require('../models/Referee');

exports.getAllReferees = async (req, res) => {
  try {
    const referees = await Referee.find();
    res.json(referees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching referees', error });
  }
};

exports.createReferee = async (req, res) => {
  try {
    const newReferee = new Referee(req.body);
    await newReferee.save();
    res.status(201).json(newReferee);
  } catch (error) {
    res.status(500).json({ message: 'Error creating referee', error });
  }
};

exports.updateReferee = async (req, res) => {
  try {
    const updatedReferee = await Referee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedReferee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating referee', error });
  }
};

exports.deleteReferee = async (req, res) => {
  try {
    await Referee.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting referee', error });
  }
};
