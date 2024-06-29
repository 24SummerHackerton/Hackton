require('dotenv').config();

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const Game = require('./models/Game');
const User = require('./models/User');
const Bracket = require('./models/Bracket');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000', // 클라이언트 도메인
  credentials: true
}));

// 구글 OAuth 2.0 설정
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5001/auth/google/callback'
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
      const user = await User.findOneAndUpdate(
        { googleId: profile.id },
        { profile: profile },
        { upsert: true, new: true }
      );
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// 미들웨어 설정
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../client/build')));

// 기본 라우트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// 구글 OAuth 2.0 인증 라우트
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);

// 로그아웃 라우트
app.get('/api/logout', (req, res) => {
  console.log('로그아웃 요청 받음');
  req.logout((err) => {
    if (err) {
      console.error('로그아웃 중 오류 발생:', err);
      return res.status(500).json({ error: '로그아웃 실패' });
    }
    console.log('req.logout 완료');
    req.session.destroy((err) => {
      if (err) {
        console.error('세션 제거 중 오류 발생:', err);
        return res.status(500).json({ error: '세션 제거 실패' });
      }
      console.log('세션 제거 완료');
      res.clearCookie('connect.sid');
      console.log('쿠키 제거 완료');
      res.status(200).json({ message: '로그아웃 성공' });
    });
  });
});

// 나머지 라우트 설정
app.use('/games', require('./routes/gameRoutes'));
app.use('/schedules', require('./routes/scheduleRoutes'));
app.use('/referees', require('./routes/refereeRoutes'));
app.use('/teams', require('./routes/teamRoutes'));
app.use('/results', require('./routes/resultRoutes'));
app.use('/api', require('./routes/api'));

// 모든 기타 라우트는 index.html로 리디렉션
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// 서버 시작
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
