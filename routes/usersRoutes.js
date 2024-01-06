var express = require('express');
var router = express.Router();

// Import User controller module
const user_controller = require('../controllers/userController');

/* GET users */
router.get('/:id', user_controller.user_detail);

router.get('/:id/delete', user_controller.user_delete_get);

router.get('/:id/update', user_controller.user_delete_get);

router.get("/create", user_controller.user_create_get);

// Post users

router.post("/:id/delete",user_controller.user_delete_post);

router.post("/:id/update", user_controller.user_update_post);

router.post("/create", user_controller.user_create_post);


module.exports = router;
