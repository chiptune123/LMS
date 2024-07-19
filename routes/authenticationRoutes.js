const verifySignUp = require("../middlewares/verifySignUp.js");
const user_controller = require("../controllers/userController");
const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
  )
  next();
})

router.get("/login", user_controller.user_login_get);

router.get("/signup", user_controller.user_create_get);

router.post("/login", user_controller.user_sign_in);

router.post("/signup", [verifySignUp.checkDuplicateUsernameOrEmail], user_controller.user_create_post);

router.get("/signout", user_controller.user_sign_out);

module.exports = router;