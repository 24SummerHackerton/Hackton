const mongoose = require('mongoose'); // Mongoose 모듈을 가져옵니다.

// GameSchema는 게임의 스키마를 정의합니다.
const GameSchema = new mongoose.Schema({
  // 게임 이름
  name: String,
  
  // 최대 참가자 수
  maxParticipants: Number,
  
  // 게임 규칙
  rules: String,
  
  // 게임 상태 (예: 모집중, 진행중, 완료)
  status: String,
  
  // 게임에 속한 팀들. 각 팀은 이름과 선수들 목록을 가집니다.
  teams: [{
    name: String,       // 팀 이름
    players: [String]   // 선수들 이름 목록
  }],
  
  // 게임 일정. 각 일정은 라운드, 팀A, 팀B, 날짜, 고유ID를 가집니다.
  schedules: [{
    round: String,      // 라운드 정보 (예: 16강, 8강, 4강, 결승)
    teamA: String,      // 팀 A의 이름
    teamB: String,      // 팀 B의 이름
    date: String,       // 경기 날짜
    uniqueId: String    // 일정의 고유 ID
  }]
});

module.exports = mongoose.model('Game', GameSchema); // Game 모델을 내보냅니다.
