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

router.get("/", user_controller.user_list);

router.get("/create", user_controller.user_create_get);

router.post("/create", verifySignUp.checkDuplicateUsernameOrEmail, user_controller.user_create_post);

router.get("/:id", user_controller.user_detail);

router.get("/:id/delete", user_controller.user_delete_get);

router.post("/:id/delete", user_controller.user_delete_post);

router.get("/:id/update", user_controller.user_update_get);

router.post("/:id/update", user_controller.user_update_post);

router.get("/api/test/all", user_controller.allAccess);

router.get("/api/test/user", [authJwt.verifyToken], user_controller.userBoard);

router.get("/api/test/librarian", [authJwt.verifyToken, authJwt.isLibrarian], user_controller.librarianBoard);

router.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], user_controller.adminBoard);

module.exports = router;
