var express = require("express");
var router = express.Router();
const authJwt = require("../middlewares/authJwt");
const verifySignUp = require("../middlewares/verifySignUp");

// Import User controller module
const user_controller = require("../controllers/userController");

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

router.post("/create", user_controller.user_create_post);

router.post("/create_staff", user_controller.staff_create_post);

router.get("/:id", user_controller.user_profile);

router.post("/:id/delete", user_controller.user_delete_post);

router.post("/:id/update", user_controller.user_update_post);

module.exports = router;
