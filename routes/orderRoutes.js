var express = require("express");
var router = express.Router();
var authJwt = require("../middlewares/authJwt");

const order_controller = require("../controllers/orderController");

router.get("/", order_controller.order_list);

router.post("/checkout", authJwt.verifyToken, order_controller.order_create_post);

router.get("/:id", order_controller.order_detail);



module.exports = router;