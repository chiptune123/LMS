var express = require('express');
var router = express.Router();

// Import announcement controller 
const annoucement_controller = require('../controllers/announcementController');

router.get("/", annoucement_controller.announcement_list);
// Create announcement routes
router.get("/:id/create", annoucement_controller.announcement_create_get);

router.post("/:id/create", annoucement_controller.announcement_create_post);
// Announcement detail routes
router.get("/:id", annoucement_controller.announcement_detail);
// Announcement delete routes
router.get("/:id/delete", annoucement_controller.announcement_delete_get );

router.post("/:id/delete", annoucement_controller.announcement_delete_post);
// Announcememt update routes
router.get("/:username/:id/update", annoucement_controller.announcement_update_get);

router.post("/:username/:id/update", annoucement_controller.announcement_update_post);

module.exports = router;