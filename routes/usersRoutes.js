var express = require('express');
var router = express.Router();

// Import User controller module
const user_controller = require('../controllers/userController');

router.get('/', user_controller.user_list);

router.get("/create", user_controller.user_create_get);

router.post("/create", user_controller.user_create_post);

router.get('/:id', user_controller.user_detail);

router.get('/:id/delete', user_controller.user_delete_get);

router.post("/:id/delete", user_controller.user_delete_post);

router.get('/:id/update', user_controller.user_update_get);

router.post("/:id/update", user_controller.user_update_post);


module.exports = router;
