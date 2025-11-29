var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var cors = require('cors');

let mongoose = require('mongoose'); // add mongoose module
let DB = require('./db'); // import the DB config file

require('./passport'); // load passport strategies

mongoose.set('maxTimeMS', 8000); // bound query time so requests fail fast instead of hanging

var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');
var authRouter = require('../routes/auth');

let AssessmentRouter = require('../routes/Assessment'); // import the Assessment router

var app = express();

// Test the DB connection
mongoose.connect(DB.URI, {
  serverSelectionTimeoutMS: 5000, // fail fast if remote DB is slow/unreachable
  socketTimeoutMS: 45000
});
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
app.use(cors());

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_session_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// expose user and flash messages to all views
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.messages = req.flash();
  next();
});
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/assessments', AssessmentRouter); // mount the Assessment router


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
