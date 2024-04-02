var express = require('express');
var router = express.Router();

// Import feedback Controller 
const feedback_controller = require("../controllers/feedbackController");

router.get("/", feedback_controller.feedback_list);

router.get("/:id", feedback_controller.feedback_detail);

router.get("/create", feedback_controller.feedback_create_get);

router.post("/create", feedback_controller.feedback_create_post);

router.get("/:id/update", feedback_controller.feedback_update_get);

router.post("/:id/update", feedback_controller.feedback_update_post);

router.get("/:id/delete", feedback_controller.feedback_delete_get);

router.post("/:id/delete", feedback_controller.feedback_delete_post);

module.exports = router;