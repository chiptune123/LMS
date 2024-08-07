const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    bio: { type: String, required: true, maxLength: 500 },
    profilePicturePath: { type: String, maxLength: 500 },
    deleteStatus: { type: Boolean, required: true, default: false },
    deleteReason: { type: String, maxLength: 500, default: "" },
})

module.exports = mongoose.model("Author", AuthorSchema);