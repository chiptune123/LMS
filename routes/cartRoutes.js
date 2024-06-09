const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/authJwt");

const book_controller = require("../controllers/bookController");

router.get("/", book_controller.cart_detail_get);

router.post("/add_to_cart", book_controller.add_cart_post);

router.post("/:id/remove_from_cart", book_controller.remove_from_cart_post);

module.exports = router;