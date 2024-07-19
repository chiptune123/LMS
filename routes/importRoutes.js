var express = require('express');
var router = express.Router();
var authJwt = require("../middlewares/authJwt");

const importLog_controller = require("../controllers/importLogController") ;
const importLog = require('../models/importLog');

router.get("/", [authJwt.isAdmin], importLog_controller.import_list);

router.post("/create", importLog_controller.import_create_post);

router.post("/:ImportLogId/delete", authJwt.isAdmin, importLog_controller.import_delete_post);

router.post("/:importLogId/update", importLog_controller.import_update_post);

module.exports = router;