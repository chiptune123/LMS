var express = require("express");
var router = express.Router();
var authJwt = require("../middlewares/authJwt");

const order_controller = require("../controllers/orderController");

// Order list by user
router.get("/", order_controller.order_list_by_user);

router.post("/checkout", order_controller.order_create_post);

router.get("/:orderId", order_controller.order_detail);

router.post("/:orderId/delete", order_controller.order_delete_post);

module.exports = router;