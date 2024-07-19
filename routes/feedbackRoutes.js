var express = require('express');
var router = express.Router();
const authJwt = require("../middlewares/authJwt");
const verifySignUp = require("../middlewares/verifySignUp");

// feedback Controller 
const feedback_controller = require("../controllers/feedbackController");

router.get("/create", feedback_controller.feedback_create_get);

router.post("/create", feedback_controller.feedback_create_post);

router.post("/:feedbackId/update", feedback_controller.feedback_update_post);

router.post("/:feedbackId/delete", feedback_controller.feedback_delete_post);

module.exports = router;