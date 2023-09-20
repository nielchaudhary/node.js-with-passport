const passport = require('passport');
const { compareSync } = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('./database');

passport.use(new LocalStrategy(async function (username, password, cb) {
  try {
    const user = await UserModel.findOne({ username: username });

    if (!user) {
      return cb(null, false, { message: 'Incorrect username or password.' });
    }

    if (!compareSync(password, user.password)) {
      return cb(null, false, { message: 'Incorrect Password' });
    }

    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
