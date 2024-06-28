const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/', teamController.getAllTeams);
router.post('/create', teamController.createTeam);
router.get('/:id', teamController.getTeamDetails);
router.post('/:id/update', teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

module.exports = router;
