var express = require('express');
var router = express.Router();
const asyncHandler = require('express-async-handler');

var authJwt = require("../middlewares/authJwt");
const book_controller = require('../controllers/bookController');
const author_controller = require("../controllers/authorController");
const feedback_controller = require("../controllers/feedbackController");
const user_controller = require("../controllers/userController");
const announcement_controller = require("../controllers/announcementController");
const import_log_controller = require("../controllers/importLogController");
const order_controller = require("../controllers/orderController");

router.get('/dashboard', asyncHandler(async (req, res, next) => {
    res.render("dashboard", { title: "Dashhboard Page" });
}));

router.get('/dashboard/book_management', book_controller.book_list);

router.get('/dashboard/author_management', author_controller.author_list);

router.get('/dashboard/feedback_management', feedback_controller.feedback_list);

router.get('/dashboard/user_management/member', user_controller.user_list_by_member);

router.get('/dashboard/user_management/staff', user_controller.user_list_by_staff);

router.get('/dashboard/announcement_management', announcement_controller.announcement_list);

router.get('/dashboard/import_log_management', import_log_controller.import_list);

router.get('/dashboard/order_management', order_controller.order_list);

router.get('/dashboard/order_management/order_detail/:orderId', order_controller.order_detail);

router.get('/dashboard/order_management/order_return/:uniqueBarcode', order_controller.order_return_get);

router.post("/dashboard/return/return_management", order_controller.order_return_by_user);

router.get('/dashboard/renewal_request_management/', order_controller.renewal_request_list_get);

router.get("/dashboard/return", order_controller.order_return_get);

router.get("/dashboard/penalty", order_controller.order_item_penalty_list_get);

module.exports = router;

