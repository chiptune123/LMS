var express = require('express');
var router = express.Router();
var authJwt = require("../middlewares/authJwt");

const importLog_controller = require("../controllers/importLogController") ;

router.get("/", [authJwt.isAdmin], importLog_controller.import_list);

router.get("/create", [authJwt.isAdmin], importLog_controller.import_create_get);

router.post("/create", [authJwt.isAdmin], importLog_controller.import_create_post);

module.exports = router;