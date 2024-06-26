var express = require('express');
var router = express.Router();
const authJwt = require("../middlewares/authJwt");
const verifySignUp = require("../middlewares/verifySignUp");


// Import feedback Controller 
const feedback_controller = require("../controllers/feedbackController");

router.get("/", [authJwt.verifyToken, authJwt.isAdminOrLibrarian], feedback_controller.feedback_list);

router.get("/:id", [authJwt.verifyToken, authJwt.isAdminOrLibrarian], feedback_controller.feedback_detail);

router.get("/create", feedback_controller.feedback_create_get);

router.post("/create", feedback_controller.feedback_create_post);

router.get("/:id/update", [authJwt.verifyToken, authJwt.isAdminOrLibrarian], feedback_controller.feedback_update_get);

router.post("/:id/update", [authJwt.verifyToken, authJwt.isAdminOrLibrarian], feedback_controller.feedback_update_post);

router.get("/:id/delete", [authJwt.verifyToken, authJwt.isAdminOrLibrarian], feedback_controller.feedback_delete_get);

router.post("/:id/delete", [authJwt.verifyToken, authJwt.isAdminOrLibrarian], feedback_controller.feedback_delete_post);

router.post("/:id/updateFeedbackStatus", [authJwt.verifyToken, authJwt.isAdminOrLibrarian], feedback_controller.feedback_update_status);

module.exports = router;