const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares/authJwt");

// Import Author controller
const author_controller = require("../controllers/authorController");

router.get("/", author_controller.author_list);
// Specific the routes endpoint should be first because endpoint with parameter will take wrong information.

router.post("/create", author_controller.author_create_post);

router.get("/:authorId", author_controller.author_detail);

router.post("/:authorId/update", author_controller.author_update_post);

router.post("/:authorId/delete", author_controller.author_delete_post);

module.exports = router;