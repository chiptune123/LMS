var express = require('express');
var router = express.Router();

// Import feedback Controller 
const feedback_controller = require("../controllers/feedbackController");

router.get("/", feedback_controller.feedback_list);

router.get("/:username/:id", feedback_controller.feedback_detail);

router.get("/create", feedback_controller.feedback_create_get);

router.post("/create", feedback_controller.feedback_create_post);

router.get("/:username/:id/update", feedback_controller.feedback_update_get);

router.post("/:username/:id/update", feedback_controller.feedback_update_post);

router.get("/:username/:id/delete", feedback_controller.feedback_delete_get);

router.post("/:username/:id/delete", feedback_controller.feedback_delete_post);

module.exports = router;