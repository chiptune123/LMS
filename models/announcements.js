const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    creationDate: {typeof: Date, required: true},
    announcementContent: {typeof: Date, required: true},
    writeID: {typeof: Schema.Types.ObjectId, ref:"User", required: true }
})

module.exports = mongoose.model("Announcement", AnnouncementSchema);