const express = require('express');
const router = express.Router();
const refereeController = require('../controllers/refereeController');

router.get('/', refereeController.getAllReferees);
router.get('/:id', refereeController.getRefereeDetails);
router.post('/create', refereeController.createReferee);
router.post('/:id/update', refereeController.updateReferee);

module.exports = router;
