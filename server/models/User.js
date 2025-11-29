const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: String,
  displayName: String,
  provider: String,
  providerId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Support both CommonJS and ESM default export shapes
const plugin = passportLocalMongoose.default || passportLocalMongoose;
UserSchema.plugin(plugin);

module.exports = mongoose.model('User', UserSchema);
