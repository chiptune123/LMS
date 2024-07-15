const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
    {
        name: { type: String, required: true, maxLength: 100 },
        email: { type: String, required: true, maxLength: 100 },
        phoneNumber: { type: String, default: "" },
        feedbackType: { type: String, required: true, enum: ["Question", "Compliment", "Bug", "Content", "Suggestion", "Other"] },
        feedbackStatus: { type: String, require: true, enum: ["Pending", "Completed"], default: "Pending" },
        feedbackMessage: { type: String, required: true, maxLength: 1000 },
        //attachment: { type: String, maxLength: 500 }
    },
    { timestamps: true })

module.exports = mongoose.model("feedback", feedbackSchema);