const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/config');

// Passport and sessions
const session = require("express-session");
const passport = require('passport');
const passportSetup = require('./config/passport-setup'); // initiates the file and sets the options for authentications

const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile');


// Mongo connection
mongoose
  .connect(`mongodb://localhost/${config.DB_NAME}`, { useNewUrlParser: true })
  .then(() => console.log('Connected to Mongo!'))
  .catch(err => console.error('Error connecting to mongo', err));

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Config and set session cookies middleware
app.use(session({
  secret: config.COOKIE_KEY,
  resave: false,
  saveUninitialized: false
}));


// Creates Passport's methods and properties on `req` for use in out routes
app.use(passport.initialize());

// Sets Passport to manage user session
app.use(passport.session());

// Routes
app.use('/', authRoutes);
app.use('/profile', profileRoutes);


app.get('/', (req, res, next) => {
  res.render('index', { title: 'Passport.js - OAuth with Google'})
})



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
