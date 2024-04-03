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

router.get("/auth/login", user_controller.userLogin_post);

router.post("/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail], user_controller.user_create_post);

router.post("/auth/login", user_controller.user_sign_in);

router.post("/auth/logout", user_controller.user_sign_out);

module.exports = router;