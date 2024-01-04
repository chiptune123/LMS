const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    name: {typeof: String, required: true, maxLength: 100},
    deleteStatus: {typeof: Boolean, required: true, default: 0},
    deleteReason: {typeof: String, maxLength:500},
})

module.exports = mongoose.model("Subject", SubjectSchema);