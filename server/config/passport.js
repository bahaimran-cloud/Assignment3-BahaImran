const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Local strategy provided by passport-local-mongoose
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Common handler to find or create OAuth users
async function findOrCreateOAuthUser(profile) {
  const email = profile.emails && profile.emails.length ? profile.emails[0].value : undefined;
  const query = [
    { provider: profile.provider, providerId: profile.id },
  ];
  if (email) {
    query.push({ email });
  }

  let user = await User.findOne({ $or: query });
  if (!user) {
    user = new User({
      username: email || `${profile.provider}-${profile.id}`,
      email,
      displayName: profile.displayName || profile.username,
      provider: profile.provider,
      providerId: profile.id
    });
    await user.save();
  } else {
    // keep provider info in sync
    user.provider = profile.provider;
    user.providerId = profile.id;
    if (email && !user.email) user.email = email;
    if (profile.displayName && !user.displayName) user.displayName = profile.displayName;
    await user.save();
  }
  return user;
}

// Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await findOrCreateOAuthUser(profile);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// GitHub OAuth strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL,
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // GitHub may not return emails without scope
    if (!profile.emails || profile.emails.length === 0) {
      profile.emails = [{ value: `${profile.username}@users.noreply.github.com` }];
    }
    const user = await findOrCreateOAuthUser(profile);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;
