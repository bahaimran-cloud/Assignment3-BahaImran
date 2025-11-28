const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser(User.serializeUser());

// Deserialize user from session
passport.deserializeUser(User.deserializeUser());

// Local Strategy
passport.use(new LocalStrategy(User.authenticate()));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ providerId: profile.id, provider: 'google' });
        
        if (!user) {
            // Check if email already exists with different provider
            const existingUser = await User.findOne({ email: profile.emails[0].value });
            if (existingUser) {
                return done(null, false, { message: 'Email already registered with different method' });
            }

            // Create new user
            user = new User({
                username: profile.emails[0].value,
                email: profile.emails[0].value,
                displayName: profile.displayName,
                provider: 'google',
                providerId: profile.id,
                providerData: profile._json
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:3000/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ providerId: profile.id, provider: 'github' });
        
        if (!user) {
            // Get email from profile (GitHub might not provide email in profile)
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
            
            // Check if email already exists with different provider
            const existingUser = await User.findOne({ email: email });
            if (existingUser && existingUser.provider !== 'github') {
                return done(null, false, { message: 'Email already registered with different method' });
            }

            // Create new user
            user = new User({
                username: profile.username,
                email: email,
                displayName: profile.displayName || profile.username,
                provider: 'github',
                providerId: profile.id,
                providerData: profile._json
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

module.exports = passport;