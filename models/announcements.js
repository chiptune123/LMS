const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema(
    {
        announcementContent: { type: String, required: true },
        writerID: { type: Schema.Types.ObjectId, ref: "User" }
    },
    { timestamps: true });

module.exports = mongoose.model("Announcement", AnnouncementSchema);