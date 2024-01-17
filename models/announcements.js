const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
    creationDate: {type: Date},
    announcementContent: {type: String, required: true},
<<<<<<< HEAD
    writerID: {type: String, required: true }
})

AnnouncementSchema.virtual("getAnnouncementObjectID").get(function(){
  return `/announcements/${this.id}`;
=======
    writeID: {type: Schema.Types.ObjectId, ref: "User" }
>>>>>>> 773fe3b (change announcement model to link to user document)
})

module.exports = mongoose.model("Announcement", AnnouncementSchema);