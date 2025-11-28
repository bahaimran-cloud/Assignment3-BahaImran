var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Authentication modules
let session = require('express-session');
let passport = require('passport');
let passportConfig = require('./passport');
let flash = require('connect-flash');
let cors = require('cors');

let mongoose = require('mongoose');
let DB = require('./db');

var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
let AssessmentRouter = require('../routes/Assessment');
let authRouter = require('../routes/auth');

// Import authentication middleware
let { userInfo } = require('./auth');

var app = express();

// Test the DB connection
mongoose.connect(DB.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error'));
mongoDB.once('open', ()=>{
  console.log('Connected to MongoDB...');
});

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

// Setup CORS
app.use(cors());

// Setup express session
app.use(session({
  secret: process.env.SESSION_SECRET || "mySecretKey",
  saveUninitialized: false,
  resave: false
}));

// Initialize flash
app.use(flash());

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Apply user info middleware to all routes
app.use(userInfo);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/assessments', AssessmentRouter);
app.use('/auth', authRouter);

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
  res.render('error', { title: 'Error' });
});

module.exports = app;