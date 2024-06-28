const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');

router.get('/', resultController.getAllResults);
router.post('/create', resultController.createResult);
router.get('/:id', resultController.getResultDetails);
router.post('/:id/update', resultController.updateResult);
router.delete('/:id', resultController.deleteResult);

module.exports = router;
