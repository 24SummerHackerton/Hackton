const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/:id/add-team', gameController.addTeam);
router.post('/:id/update-team', gameController.updateTeam);
router.post('/:id/create-bracket', gameController.createBracket);
router.get('/brackets', gameController.getBrackets);

module.exports = router;
