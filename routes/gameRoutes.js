const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Add this line to import the Game model
const Game = require('../models/Game');

router.post('/:id/add-team', gameController.addTeam);
router.post('/:id/update-team', gameController.updateTeam);
router.post('/:id/create-bracket', gameController.createBracket);
router.get('/brackets', gameController.getBrackets);

router.post('/create', async (req, res) => {
  if (req.isAuthenticated()) {
    const { name, maxParticipants, rules } = req.body;
    const newGame = new Game({ name, maxParticipants, rules, status: '모집중' });
    try {
      await newGame.save();
      res.redirect('/manage.html');
    } catch (err) {
      console.error('Error creating game:', err);
      res.status(500).send('Error creating game.');
    }
  } else {
    res.redirect('/');
  }
});

module.exports = router;