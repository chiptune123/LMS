var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');

var authJwt = require("../middlewares/authJwt");
const book_controller = require('../controllers/bookController');

router.get('/dashboard', asyncHandler(async (req, res, next) => {
    res.render("dashboard", { title: "Dashhboard Page" });
}));

router.get('/dashboard/book_data_table', book_controller.book_list);

module.exports = router;

