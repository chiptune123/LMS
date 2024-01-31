const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    creationDate: {type: Date},
    name: {type: String, required: true, maxLength: 100},
    email: {type: String, required: true, maxLength: 100},
    phoneNumber: {type: Number},
    feedbackType: {type: String, required: true, enum:["Question", "Compliment", "Bug", "Content", "Suggestion", "Other"]},
    feedbackStatus: {type: Boolean, default: false},
    feedbackMessage: {type: String, required: true, maxLength: 1000},
    attachment: {type: String, maxLength: 500}
})

module.exports = mongoose.model("feedback",feedbackSchema);