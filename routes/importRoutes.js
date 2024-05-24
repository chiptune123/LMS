var express = require('express');
var router = express.Router();

const importLog_controller = require("../controllers/importLogController") ;

router.get("/", importLog_controller.import_create_get);

router.post("/", importLog_controller.import_create_post);

module.exports = router;