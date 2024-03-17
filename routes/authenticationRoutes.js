const { verifySignUp } = require("../middlewares/verifySignUp.js");
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

router.post("/api/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail], user_controller.user_create_post);

router.post("/api/auth/signin", user_controller.user_sign_in);

router.post("/api/auth/signout", user_controller.user_sign_out);

module.exports = router;