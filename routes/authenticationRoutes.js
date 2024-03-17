const { verifySignUp } = require("../middlewares/verifySignUp.js");
const controller = require("../controllers/userController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/auth/signup", [verifySignUp.checkDuplicateUsernameOrEmail], controller.user_create_post);

  app.post("/api/auth/signin", controller.user_sign_in);

  app.post("/api/auth/signout", controller.user_sign_out);
};
