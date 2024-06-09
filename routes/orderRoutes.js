var express = require("express");
var router = express.Router();
var authJwt = require("../middlewares/authJwt");

const order_controller = require("../controllers/orderController");

router.get("/", order_controller.order_list);

router.get("/:id", order_controller.order_detail);

router.post("/:id/checkout", order_controller.order_create_post);

module.exports = router;