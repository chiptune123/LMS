const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { typeof: String, required: true, maxLength: 100 },
    password: { typeof: String, required: true, maxLength: 100 },
    name: { typeof: String, required: true, maxLength: 100 },
    email: { typeof: String, required: true, maxLength: 100 },
    phoneNumber: {typeof: Number},
    address: {typeof: String, required: true, maxLength: 100},
    role: {typeof: String, required: true, maxLength: 100},
    verificationStatus: {typeof: Boolean, default: 0},
    profilePicture: {typeof: String, maxLength: 500},
    deleteStatus: {typeof: Boolean, default: 0},
    deleteReason: {typeof: String, maxLength: 500},
})

module.exports = mongoose.model("User", UserSchema);