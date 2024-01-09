const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    creationDate: {type: Date},
    announcementContent: {type: String, required: true},
    writeID: {type: String, required: true }
})

module.exports = mongoose.model("Announcement", AnnouncementSchema);