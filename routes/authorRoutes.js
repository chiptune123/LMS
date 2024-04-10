const express = require("express");
const router = express.Router();
const { authJwt } = require("../middlewares/authJwt");

// Import Author controller
const author_controller = require("../controllers/authorController");

router.get("/", author_controller.author_list);
// Specific the routes endpoint should be first because endpoint with parameter will take wrong information.
router.get("/create", author_controller.author_create_get);

router.post("/create", author_controller.author_create_post);

router.get("/:id", author_controller.author_detail);

// router.get("/create", author_controller.author_create_get);

// router.post("/create", author_controller.author_create_post);

router.get("/:id/update", author_controller.author_update_get);

router.post("/:id/update", author_controller.author_update_post);

router.get("/:id/delete", author_controller.author_delete_get);

router.post("/:id/delete", author_controller.author_delete_post);

module.exports = router;