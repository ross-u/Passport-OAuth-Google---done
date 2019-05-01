const express = require('express');
const router = express.Router();
const passport = require('passport');

// GET '/login'
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});


// GET '/logout'
router.get('/logout', (req, res, next) => {
  // handle with passport
  req.logout();
  res.redirect('/login');
});



// GET '/google'  --> Opens A Grant Permition Screen
router.get('/google', passport.authenticate('google', { scope: ['profile'] } ));
// Redirects user to the consent screen
// in `scope` we set which informations we want to access from users Google account



// Successful Google redirect with code upon user granting permition
// GET  '/success/redirect'
router.get('/success/redirect', passport.authenticate('google'), (req, res, next) => {
  // passport.authenticate initiates the callback function in GoogleStrategy --> through `passport.authenticate`
  res.redirect('/profile')
});

module.exports = router;
