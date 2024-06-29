const express = require('express');
const router = express.Router();
const refereeController = require('../controllers/refereeController');

router.get('/', refereeController.getAllReferees);
router.post('/', refereeController.createReferee);
router.patch('/:id', refereeController.updateReferee);
router.delete('/:id', refereeController.deleteReferee);

module.exports = router;
