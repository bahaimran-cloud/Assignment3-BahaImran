const express = require('express');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

// Render login page
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/assessments');
  }
  res.render('auth/login', { title: 'Login' });
});

// Local login
router.post('/login', (req, res, next) => {
  const started = Date.now();
  let responded = false;
  const timer = setTimeout(() => {
    if (responded) return;
    responded = true;
    console.warn('Login timed out after 12s');
    req.flash('error', 'Login is taking longer than expected. Please try again.');
    return res.redirect('/auth/login');
  }, 12000);

  passport.authenticate('local', (err, user, info) => {
    if (responded) return;
    clearTimeout(timer);
    responded = true;
    if (err) {
      console.error('Login error', err);
      req.flash('error', 'Unexpected error during login.');
      return res.redirect('/auth/login');
    }
    if (!user) {
      req.flash('error', info && info.message ? info.message : 'Invalid credentials.');
      return res.redirect('/auth/login');
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Login session error', loginErr);
        req.flash('error', 'Could not start session.');
        return res.redirect('/auth/login');
      }
      console.log(`Login success in ${Date.now() - started}ms`);
      return res.redirect('/assessments');
    });
  })(req, res, next);
});

// Local register
router.get('/register', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/assessments');
  }
  res.render('auth/register', { title: 'Register' });
});

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ username, email, displayName: username, provider: 'local' });
    await User.register(user, password);
    req.flash('success', 'Account created. Please log in.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error', err.message || 'Registration failed');
    res.redirect('/auth/register');
  }
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/login',
    failureFlash: true
  }),
  (req, res) => res.redirect('/assessments')
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/auth/login',
    failureFlash: true
  }),
  (req, res) => res.redirect('/assessments')
);

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
