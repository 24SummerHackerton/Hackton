const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const Game = require('../models/Game'); // Game 모델을 가져옵니다.

// 모든 게임을 가져오는 라우트
router.get('/all-games', gameController.getAllGames);

// 특정 게임을 ID로 가져오는 라우트
router.get('/:id', gameController.getGameById);

// 게임에 팀을 추가하는 라우트
router.post('/:id/add-team', gameController.addTeam);

// 게임 내 팀을 업데이트하는 라우트
router.post('/:id/update-team', gameController.updateTeam);

// 브래킷 생성 라우트
router.post('/:id/create-bracket', gameController.createBracket);

// 모든 브래킷을 가져오는 라우트
router.get('/brackets', gameController.getBrackets);

// 게임 생성 라우트
router.post('/create', async (req, res) => {
  if (req.isAuthenticated()) { // 인증된 사용자만 접근 가능
    const { name, maxParticipants, rules } = req.body;
    const newGame = new Game({ name, maxParticipants, rules, status: '모집중' });
    try {
      await newGame.save();
      res.redirect('/manage.html'); // 게임 생성 후 관리 페이지로 리다이렉트
    } catch (err) {
      console.error('Error creating game:', err);
      res.status(500).send('Error creating game.');
    }
  } else {
    res.redirect('/'); // 인증되지 않은 사용자는 루트 페이지로 리다이렉트
  }
});

module.exports = router;
