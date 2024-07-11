var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');

var authJwt = require("../middlewares/authJwt");
const book_controller = require('../controllers/bookController');
const author_controller = require("../controllers/authorController");
const feedback_controller = require("../controllers/feedbackController");
const user_controller = require("../controllers/userController");
router.get('/dashboard', asyncHandler(async (req, res, next) => {
    res.render("dashboard", { title: "Dashhboard Page" });
}));

router.get('/dashboard/book_data_table', book_controller.book_list);

router.get('/dashboard/author_data_table', author_controller.author_list);

router.get('/dashboard/feedback_data_table', feedback_controller.feedback_list);

router.get('/dashboard/user_management/member', user_controller.user_list_by_member);

router.get('/dashboard/user_management/staff', user_controller.user_list_by_staff);

module.exports = router;

