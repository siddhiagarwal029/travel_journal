// passportConfig.js
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user'); // path to your User model

module.exports = function(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: 'No user found' });
        }

        // 🛑 Basic password check (no hashing yet)
        if (user.password !== password) {
          return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // serialize/deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
