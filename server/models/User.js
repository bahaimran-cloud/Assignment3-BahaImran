const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// Create the User Schema
const UserSchema = new Schema({
    username: {
        type: String,
        default: '',
        trim: true
    },
    email: {
        type: String,
        default: '',
        trim: true,
        required: 'Email is required'
    },
    displayName: {
        type: String,
        default: '',
        trim: true
    },
    provider: {
        type: String,
        default: 'local'
    },
    providerId: {
        type: String
    },
    providerData: {},
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'users'
});

// Plugin passport-local-mongoose
UserSchema.plugin(passportLocalMongoose, {
    missingPasswordError: 'Wrong/Missing Password',
    usernameField: 'username'
});

// Export the model
module.exports = mongoose.model('User', UserSchema);