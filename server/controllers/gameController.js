const Game = require('../models/Game');

exports.createGame = async (req, res) => {
  const { eventName, participants, rules } = req.body;
  
  const newGame = new Game({
    eventName,
    participants,
    rules,
    teams: [],  // 초기에는 팀이 없으므로 빈 배열로 시작
  });

  try {
    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (err) {
    res.status(500).json({ error: 'Error creating game' });
  }
};
