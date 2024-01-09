const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    creationDate: {type: Date, required: true},
    announcementContent: {type: Date, required: true},
    writeID: {type: Schema.Types.ObjectId, ref:"User", required: true }
})

module.exports = mongoose.model("Announcement", AnnouncementSchema);