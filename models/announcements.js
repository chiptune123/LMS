const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    creationDate: {type: Date},
    announcementContent: {type: String, required: true},
    writerID: {type: Schema.Types.ObjectId, ref: "User" }
})

module.exports = mongoose.model("Announcement", AnnouncementSchema);