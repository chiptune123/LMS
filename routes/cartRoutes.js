const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/authJwt");

const book_controller = require("../controllers/bookController");
const order_controller = require("../controllers/orderController");
const cart_controller = require("../controllers/cartController");

router.get("/", cart_controller.cart_detail_get);

router.post("/checkout", [authJwt.verifyToken], order_controller.order_create_post);

router.post("/add_to_cart", cart_controller.add_cart_post);

router.post("/remove_from_cart", cart_controller.remove_from_cart_post);

module.exports = router;