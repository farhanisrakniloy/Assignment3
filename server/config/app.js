const express = require('express');
const { authenticate, identifyUser } = require('../middleware/AuthGuard'); // Ensure this path is correct
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./db'); // Database connection
const createError = require('http-errors');

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
app.use(authenticate); // Use the authenticate middleware
app.use(identifyUser); // Use the identifyUser middleware
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.user || null; // Pass `req.user` to all views or null if not logged in
  next();
});

// Routes setup
const indexRouter = require('../routes/index'); // Corrected path
const booksRouter = require('../routes/bookroutes'); // Corrected path
const usersRouter = require('../routes/users'); // Corrected path

app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/users', usersRouter);

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