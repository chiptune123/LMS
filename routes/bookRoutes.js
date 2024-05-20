const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares/authJwt");

// Import Author controller
const book_controller = require("../controllers/bookController");

router.get("/", book_controller.book_list);

// Specific the routes endpoint should be first because endpoint with parameter will take wrong information.
router.get("/create", book_controller.book_create_get);

router.post("/create", book_controller.book_create_post);

router.post("/add_to_cart", book_controller.add_cart_post);

router.get("/:id", book_controller.book_detail);

// router.get("/create", book_controller.author_create_get);

// router.post("/create", book_controller.author_create_post);



router.get("/:id/update", book_controller.book_update_get);

router.post("/:id/update", book_controller.book_update_post);

router.get("/:id/delete", book_controller.book_delete_get);

router.post("/:id/delete", book_controller.book_delete_post);

module.exports = router;
