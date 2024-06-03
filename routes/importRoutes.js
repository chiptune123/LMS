var express = require('express');
var router = express.Router();
var authJwt = require("../middlewares/authJwt");

const importLog_controller = require("../controllers/importLogController") ;
const importLog = require('../models/importLog');

router.get("/", [authJwt.isAdmin], importLog_controller.import_list);

router.get("/create", [authJwt.isAdmin], importLog_controller.import_create_get);

router.post("/create", [authJwt.isAdmin], importLog_controller.import_create_post);

//router.get("/:id/delete", authJwt.isAdmin, importLog_controller.import_delete_get);

router.post("/:id/delete", authJwt.isAdmin, importLog_controller.import_delete_post);

module.exports = router;