var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();

// Import Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRoutes');
var announcementRouter = require('./routes/announcementRoutes');
var feedbackRouter = require('./routes/feedbackRoutes');

var app = express();
const mongoose = require('mongoose');
const { error } = require('console');
mongoose.set("strictQuery",false);
const mongoDBConnect = process.env.mongoDBConnectionString;

async function main(){
  await mongoose.connect(mongoDBConnect).then(() => {
    console.log("Connecting to MongoDB...");
  }).catch((err) => {
    console.log("Not connected to database: ", err);
  })
  console.log(`MongoDB connect Status: ${mongoose.connection.readyState}`);
}

main().catch(err => console.log(error));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routers configuration
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/announcements', announcementRouter);
app.use('/feedbacks', feedbackRouter);

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
