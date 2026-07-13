const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

module.exports = (passport) => {
    // Local Strategy
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                // User dhundo
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'Email not found!' });
                }

                // Password check
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Wrong password!' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    // Serialize User - session mein user id save karo
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize User - session se user nikalo
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};