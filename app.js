var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cookieSession = require("cookie-session");
var cors = require("cors");
require('dotenv').config();
var authJwt = require("./middlewares/authJwt")

// Import Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRoutes');
var announcementRouter = require('./routes/announcementRoutes');
var feedbackRouter = require('./routes/feedbackRoutes');
var authenticationRoutes = require('./routes/authenticationRoutes');
var authorRouter = require('./routes/authorRoutes');
var subjectRouter = require('./routes/subjectRoutes');
var bookRouter = require('./routes/bookRoutes');
var importRouter = require('./routes/importRoutes');
var cartRouter = require("./routes/cartRoutes");
var orderRouter = require("./routes/orderRoutes");

var app = express();
const mongoose = require('mongoose');
const { error } = require('console');
mongoose.set("strictQuery", false);
const mongoDBConnect = process.env.mongoDBConnectionString;

async function main() {
  await mongoose.connect(mongoDBConnect).then(() => {
    console.log(`Successfully connect to MongoDB: ${mongoose.connection.readyState}`);
  }).catch((err) => {
    console.log("Not connected to database: ", err);
  })
}

main().catch(err => console.log(error));

// Cors Setup
var corsOptions = {
  origin: "http://localhost:3000",
}

app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  cookieSession({
    name: "Chiptune-session",
    keys: ["COOKIE_SECRET"],
    httpOnly: true
  })
);

//Jwt configuration
//app.use(authJwt.verifyToken);

app.get('/login', (req, res) => {
  res.json({message: "Welcome to the login page"});
})

// Routers configuration
app.use('/', indexRouter);
app.use('/auth', authenticationRoutes);
app.use('/users', usersRouter);
app.use('/announcements', announcementRouter);
app.use('/feedbacks', feedbackRouter);
app.use('/authors', authorRouter);
app.use('/subjects', subjectRouter);
app.use('/books', bookRouter);
app.use('/imports', authJwt.verifyToken, importRouter);
app.use('/carts', cartRouter);
app.use('/orders', orderRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
