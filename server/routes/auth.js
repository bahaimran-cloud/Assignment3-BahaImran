let express = require('express');
let router = express.Router();
let passport = require('passport');
let User = require('../models/User');

// GET /auth/login - Display login page
router.get('/login', (req, res, next) => {
    if (!req.user) {
        res.render('auth/login', {
            title: 'Login',
            messages: req.flash('loginMessage'),
            displayName: ''
        });
    } else {
        return res.redirect('/');
    }
});

// POST /auth/login - Process login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/auth/login');
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/assessments');
        });
    })(req, res, next);
});

// GET /auth/register - Display registration page
router.get('/register', (req, res, next) => {
    if (!req.user) {
        res.render('auth/register', {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: ''
        });
    } else {
        return res.redirect('/');
    }
});

// POST /auth/register - Process registration
router.post('/register', (req, res, next) => {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        displayName: req.body.displayName
    });

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log('Error: Inserting New User');
            if (err.name === 'UserExistsError') {
                req.flash('registerMessage', 'Registration Error: User Already Exists!');
            } else {
                req.flash('registerMessage', 'Server Error');
            }
            return res.redirect('/auth/register');
        } else {
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/assessments');
            });
        }
    });
});

// GET /auth/logout - Logout user
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// Google Authentication Routes
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login', failureFlash: true }),
    (req, res) => {
        res.redirect('/assessments');
    }
);

// GitHub Authentication Routes
router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/login', failureFlash: true }),
    (req, res) => {
        res.redirect('/assessments');
    }
);

module.exports = router;