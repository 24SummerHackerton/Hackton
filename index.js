require('dotenv').config();

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Game = require('./models/Game');
const User = require('./models/User');
const Bracket = require('./models/Bracket');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

// 구글 OAuth 2.0 설정
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
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

// 라우트 설정
app.use('/games', require('./routes/gameRoutes'));
app.use('/schedules', require('./routes/scheduleRoutes'));
app.use('/referees', require('./routes/refereeRoutes'));
app.use('/teams', require('./routes/teamRoutes'));
app.use('/results', require('./routes/resultRoutes'));
app.use('/api', require('./routes/api'));  // 새로운 라우트 추가

// 기본 라우트
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/manage.html', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(__dirname + '/views/manage.html');
  } else {
    res.redirect('/');
  }
});

app.get('/createGame.html', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(__dirname + '/views/createGame.html');
  } else {
    res.redirect('/');
  }
});

app.get('/games', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const games = await Game.find({});
      res.json(games);
    } catch (err) {
      console.error('Error fetching games:', err);
      res.status(500).send('Error fetching games.');
    }
  } else {
    res.redirect('/');
  }
});

app.get('/games/:id/json', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const game = await Game.findById(req.params.id);
      if (!game) {
        res.status(404).send('Game not found.');
      } else {
        res.json(game);
      }
    } catch (err) {
      console.error('Error fetching game details:', err);
      res.status(500).send('Error fetching game details.');
    }
  } else {
    res.redirect('/');
  }
});

app.get('/gameDetails.html', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(__dirname + '/views/gameDetails.html');
  } else {
    res.redirect('/');
  }
});

app.get('/api/games', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const games = await Game.find({});
      res.json(games);
    } catch (err) {
      console.error('Error fetching games:', err);
      res.status(500).send('Error fetching games.');
    }
  } else {
    res.redirect('/');
  }
});

app.get('/api/brackets', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const brackets = await Bracket.find({}).populate('game');
      res.json(brackets);
    } catch (err) {
      console.error('Error fetching brackets:', err);
      res.status(500).send('Error fetching brackets.');
    }
  } else {
    res.redirect('/');
  }
});

app.get('/api/games/:id', async (req, res) => {
    if (req.isAuthenticated()) {
      try {
        const game = await Game.findById(req.params.id);
        if (!game) {
          res.status(404).send('Game not found.');
        } else {
          res.json(game);
        }
      } catch (err) {
        console.error('Error fetching game details:', err);
        res.status(500).send('Error fetching game details.');
      }
    } else {
      res.redirect('/');
    }
  });

app.post('/create-game', async (req, res) => {
    if (req.isAuthenticated()) {
      const { name, maxParticipants, rules } = req.body;
      const newGame = new Game({ name, maxParticipants, rules, status: '모집중' });
      try {
        await newGame.save();
        res.redirect('/manage.html');
      } catch (err) {
        console.error('Error creating game:', err);
        res.status(500).send('Error creating game.');
      }
    } else {
      res.redirect('/');
    }
  });

app.get('/allData.html', (req, res) => {
  res.sendFile(__dirname + '/views/allData.html');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/manage.html');
  }
);

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
