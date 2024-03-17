const { verifySignUp } = require("../middlewares/verifySignUp.js");
const controller = require("../controllers/userController");
const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
  )
  next();
})

router.post("/api/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail], controller.user_create_post);

router.post("/api/auth/signin", controller.user_sign_in);

router.post("/api/auth/signout", controller.user_sign_out);