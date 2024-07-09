var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');

const authJwt = require('../middlewares/authJwt');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect("/books");
});

module.exports = router;
