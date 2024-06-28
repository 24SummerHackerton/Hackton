const express = require('express');
const router = express.Router();
const bracketController = require('../controllers/bracketController');

router.post('/games/:gameId/bracket', bracketController.createBracket);
router.get('/', bracketController.getBrackets); // 전체 브래킷 조회

module.exports = router;
