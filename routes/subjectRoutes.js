var express = require("express");
var router = express.Router();
const { authJwt } = require("../middlewares/authJwt");

// Import subject controller module
const subject_controller = require("../controllers/subjectController");

// Add CORS to response Header
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});

router.get("/", subject_controller.subject_list);

router.get("/create", subject_controller.subject_create_get);

router.post("/create", subject_controller.subject_create_post);

router.get("/:id", subject_controller.subject_detail);

router.get("/:id/update", subject_controller.subject_update_get);

router.post("/:id/update", subject_controller.subject_update_post);

router.get("/:id/delete", subject_controller.subject_delete_get);

router.post("/:id/delete", subject_controller.subject_delete_post);

module.exports = router;