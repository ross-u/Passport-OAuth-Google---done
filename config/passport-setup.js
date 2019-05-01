const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./config');
const User = require('../models/user');

// serializeUser: defines what data to save in the session
// (this happens when you log in successfully)
// Also sets the user.id on the cookie
passport.serializeUser((user, done) => {
    done(null, user.id);
});


// deserializeUser: defines how to retrieve the user information from the session storage. Takes id from the cookie
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);	//	sets the value to `req.user`
    });
});

passport.use(
  new GoogleStrategy({
    // Authentication options for Google Strategy
    clientID: '',
    clientSecret: '',
    callbackURL: '/success/redirect'
  },
    (sucessToken, refreshToken, profile, done) => {

      User.findOne({ googleId: profile.id })
        .then((currentUser) => {
          if (currentUser) { // user already exists
          done(null, currentUser);  // `done()` forwards value to serializeUser
        } 
        else {  // if not, create user in our db
          User.create({
            googleId: profile.id,
            username: profile.displayName,
            picture: profile.photos[0].value
          })
          .then((newUser) => {
            done(null, newUser);  // `done()` forwards value to serializeUser
          })
          .catch(err => console.log('Error in passport-setup.js new user creation', err))
        }
      })
      .catch(err => console.log('Error in passport-setup.js', err))
    }  // passport callback function

  ));
