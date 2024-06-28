require('dotenv').config();

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Game = require('./models/Game');

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
  resave: true, 
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

// 라우트 설정
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/games');
  }
);

app.get('/games', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const games = await Game.find({});
      if (games.length === 0) {
        res.redirect('/create-game');
      } else {
        res.send(`
          <h1>Game List</h1>
          <ul>
            ${games.map(game => `
              <li>
                ${game.name} - ${game.status}
                <a href="/games/${game._id}">Details</a>
              </li>`).join('')}
          </ul>
          <a href="/create-game">Create a new game</a>
        `);
      }
    } catch (err) {
      console.error('Error fetching games:', err);
      res.status(500).send('Error fetching games.');
    }
  } else {
    res.redirect('/');
  }
});

app.get('/create-game', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(__dirname + '/views/create-game.html');
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
      res.redirect('/games');
    } catch (err) {
      console.error('Error creating game:', err);
      res.status(500).send('Error creating game.');
    }
  } else {
    res.redirect('/');
  }
});

app.get('/games/:id', async (req, res) => {
    if (req.isAuthenticated()) {
      try {
        const game = await Game.findById(req.params.id);
        if (!game) {
          res.status(404).send('Game not found.');
        } else {
          const isFull = game.teams.reduce((count, team) => count + team.players.length, 0) >= game.maxParticipants;
          const status = isFull ? '마감됨' : '모집중';
          res.send(`
            <h1>선수 모집 페이지</h1>
            <h2>${game.name}</h2>
            <p>Status: ${status}</p>
            <p>Rules: ${game.rules}</p>
            <h2>Teams</h2>
            <ul>
              ${game.teams.map(team => `
                <li>
                  ${team.name} - Players: ${team.players.join(', ')}
                  <form action="/games/${game._id}/update-team" method="post">
                    <input type="hidden" name="teamId" value="${team._id}">
                    <input type="text" name="players" value="${team.players.join(', ')}">
                    <button type="submit">Update Players</button>
                  </form>
                </li>`).join('')}
            </ul>
            ${status === '모집중' ? `
            <form action="/games/${game._id}/add-team" method="post">
              <h3>Add Team</h3>
              <label for="teamName">Team Name:</label>
              <input type="text" id="teamName" name="teamName" required>
              <br>
              <label for="players">Players (comma separated):</label>
              <input type="text" id="players" name="players" required>
              <br>
              <button type="submit">Add Team</button>
            </form>
            ` : `
            <p>모집이 마감되었습니다.</p>
            `}
            <a href="/games">Back to Game List</a>
          `);
        }
      } catch (err) {
        console.error('Error fetching game details:', err);
        res.status(500).send('Error fetching game details.');
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
          res.json(game); // JSON 형식으로 게임 상세 정보 반환
        }
      } catch (err) {
        console.error('Error fetching game details:', err);
        res.status(500).send('Error fetching game details.');
      }
    } else {
      res.redirect('/');
    }
  });
  

app.post('/games/:id/add-team', async (req, res) => {
  if (req.isAuthenticated()) {
    const { teamName, players } = req.body;
    try {
      const game = await Game.findById(req.params.id);
      if (!game) {
        res.status(404).send('Game not found.');
      } else {
        const isFull = game.teams.reduce((count, team) => count + team.players.length, 0) >= game.maxParticipants;
        if (isFull) {
          res.status(400).send('Game is already full.');
        } else {
          game.teams.push({ name: teamName, players: players.split(',').map(player => player.trim()) });
          await game.save();
          res.redirect(`/games/${game._id}`);
        }
      }
    } catch (err) {
      console.error('Error adding team:', err);
      res.status(500).send('Error adding team.');
    }
  } else {
    res.redirect('/');
  }
});

app.post('/games/:id/update-team', async (req, res) => {
  if (req.isAuthenticated()) {
    const { teamId, players } = req.body;
    try {
      const game = await Game.findById(req.params.id);
      if (!game) {
        res.status(404).send('Game not found.');
      } else {
        const team = game.teams.id(teamId);
        if (team) {
          team.players = players.split(',').map(player => player.trim());
          await game.save();
          res.redirect(`/games/${game._id}`);
        } else {
          res.status(404).send('Team not found.');
        }
      }
    } catch (err) {
      console.error('Error updating team:', err);
      res.status(500).send('Error updating team.');
    }
  } else {
    res.redirect('/');
  }
});

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
