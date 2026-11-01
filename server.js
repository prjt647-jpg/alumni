const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db');

require('./seed')();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1); // needed behind Render/Heroku proxies for secure cookies
app.use(express.json({ limit: '100kb' }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-this-secret-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000, secure: 'auto' },
  })
);

// ---------- API routes ----------
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/alumni'));
app.use('/api/connections', require('./routes/connections'));
app.use('/api/events', require('./routes/events'));
app.use('/api/mentoring', require('./routes/mentoring'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/admin', require('./routes/admin'));

// Public numbers for the home page
app.get('/api/public/stats', (req, res) => {
  const users = db.all('users');
  res.json({
    alumni: users.filter((u) => u.role === 'alumni').length,
    students: users.filter((u) => u.role === 'student').length,
    events: db.all('events').length,
    jobs: db.all('jobs').length,
  });
});

app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));

// ---------- Front end (static HTML/CSS/Bootstrap/jQuery) ----------
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Error handler ----------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => console.log(`Alumni Portal running on http://localhost:${PORT}`));
