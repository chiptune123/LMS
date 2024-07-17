const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares/authJwt");

// Import Author controller
const book_controller = require("../controllers/bookController");

router.get("/", book_controller.book_list);

router.post("/create", book_controller.book_create_post);

// Specific routes endpoint should be first because endpoint with parameter will take wrong information.

router.get("/:bookId", book_controller.book_detail);

router.post("/:bookId/update", book_controller.book_update_post);

router.post("/:bookId/delete", book_controller.book_delete_post);

module.exports = router;
