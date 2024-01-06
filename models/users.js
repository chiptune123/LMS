const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true, maxLength: 100 },
    password: { type: String, required: true, maxLength: 100 },
    name: { type: String, required: true, maxLength: 100 },
    email: { type: String, required: true, maxLength: 100 },
    phoneNumber: {type: Number},
    address: {type: String, required: true, maxLength: 100},
    role: {type: String, required: true, maxLength: 100},
    verificationStatus: {type: Boolean, default: 0},
    profilePicture: {type: String, maxLength: 500},
    deleteStatus: {type: Boolean, default: 0},
    deleteReason: {type: String, maxLength: 500},
})

module.exports = mongoose.model("User", UserSchema);