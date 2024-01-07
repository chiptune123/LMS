const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, maxLength: 100 },
    password: { type: String, required: true, maxLength: 100 },
    name: { type: String, required: true, maxLength: 100 },
    email: { type: String, required: true, maxLength: 100 },
    phoneNumber: {type: Number, default: ""},
    address: {type: String, maxLength: 100, default: ""},
    role: {type: String, maxLength: 100, enum: ["Admin", "User", "Librarian"], default: "User"},
    verificationStatus: {type: Boolean, default: false},
    profilePicture: {type: String, maxLength: 500, default: ""},
    deleteStatus: {type: Boolean, default: false},
    deleteReason: {type: String, maxLength: 500, default: ""},
})

module.exports = mongoose.model("User", UserSchema);