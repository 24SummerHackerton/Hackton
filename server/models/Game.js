const mongoose = require('mongoose'); // Mongoose 모듈을 가져옵니다.

// TeamSchema는 각 팀의 스키마를 정의합니다.
const TeamSchema = new mongoose.Schema({
  name: String,          // 팀 이름
  players: [String],     // 선수들 이름 목록
  maxParticipants: Number // 팀별 최대 참가자 수
});

// GameSchema는 게임의 스키마를 정의합니다.
const GameSchema = new mongoose.Schema({
  name: String,          // 게임 이름
  maxParticipants: Number, // 게임의 최대 참가자 수
  rules: String,         // 게임 규칙
  status: String,        // 게임 상태 (예: 모집중, 진행중, 완료)
  teams: [TeamSchema],   // 게임에 속한 팀들
  schedules: [{          // 게임 일정
    round: String,       // 라운드 정보 (예: 16강, 8강, 4강, 결승)
    teamA: String,       // 팀 A의 이름
    teamB: String,       // 팀 B의 이름
    date: String,        // 경기 날짜
    gameId: String,      // 고유 경기 ID
    uniqueId: String     // 일정의 고유 ID
  }]
});

module.exports = mongoose.model('Game', GameSchema); // Game 모델을 내보냅니다.
