var express = require('express');
var router = express.Router();

// Import announcement controller 
const annoucement_controller = require('../controllers/announcementController');

router.get("/", annoucement_controller.announcement_list);

router.post("/create", annoucement_controller.announcement_create_post);
// Announcement detail routes
router.get("/:announcementId", annoucement_controller.announcement_detail);
// Announcement delete routes
router.post("/:announcementId/delete", annoucement_controller.announcement_delete_post);
// Announcememt update routes
router.post("/:announcementId/update", annoucement_controller.announcement_update_post);

module.exports = router;