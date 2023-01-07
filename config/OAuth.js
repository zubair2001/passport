var GoogleStrategy = require('passport-google-oauth20').Strategy;
// const passport = require('passport');
const User = require('../models/User');
require('dotenv').config();

module.exports = function(passport) {

    
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
            // Save the user to the database
            User.findOneAndUpdate({ googleId: profile.id }, { $set: { googleId: profile.id } }, { upsert: true, returnOriginal: false },
                (insertErr, result) => {
                User.close();
                if (insertErr) {
                    return cb(insertErr);
                }
                return cb(null, result.ops[0]);
            });
        })
        );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
        });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
        done(err, user);
        });
    });
    }