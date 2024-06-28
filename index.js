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
  .catch(err => console.log(err));

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
app.use(session({ secret: process.env.SECRET_KEY, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

// 라우트 설정
app.get('/', (req, res) => {
  res.send(`
    <h1>Login with Google</h1>
    <a href="/auth/google">Login with Google</a>
  `);
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

app.get('/games', (req, res) => {
  if (req.isAuthenticated()) {
    Game.find({}, (err, games) => {
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
    });
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

app.post('/create-game', (req, res) => {
  if (req.isAuthenticated()) {
    const { name, maxParticipants, rules } = req.body;
    const newGame = new Game({ name, maxParticipants, rules });
    newGame.save(err => {
      if (err) return res.status(500).send('Error creating game.');
      res.redirect('/games');
    });
  } else {
    res.redirect('/');
  }
});

app.get('/games/:id', (req, res) => {
  if (req.isAuthenticated()) {
    Game.findById(req.params.id, (err, game) => {
      if (err) return res.status(500).send('Game not found.');
      res.send(`
        <h1>${game.name}</h1>
        <p>Status: ${game.status}</p>
        <p>Rules: ${game.rules}</p>
        <h2>Teams</h2>
        <ul>
          ${game.teams.map(team => `
            <li>
              ${team.name} - Players: ${team.players.join(', ')}
            </li>`).join('')}
        </ul>
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
        <a href="/games">Back to Game List</a>
      `);
    });
  } else {
    res.redirect('/');
  }
});

app.post('/games/:id/add-team', (req, res) => {
  if (req.isAuthenticated()) {
    const { teamName, players } = req.body;
    Game.findById(req.params.id, (err, game) => {
      if (err) return res.status(500).send('Game not found.');
      game.teams.push({ name: teamName, players: players.split(',').map(player => player.trim()) });
      game.save(err => {
        if (err) return res.status(500).send('Error adding team.');
        res.redirect(`/games/${game._id}`);
      });
    });
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
