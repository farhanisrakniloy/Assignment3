const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./db'); // Database connection
const createError = require('http-errors');
const session = require('express-session');
const passport = require('../routes/passport'); // Adjust the path to your Passport configuration
const flash = require('connect-flash'); // Import connect-flash

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Session setup
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Use connect-flash
app.use(flash());

// Define your routes here
const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const booksRouter = require('../routes/bookroutes');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;