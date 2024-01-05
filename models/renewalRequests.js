const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RenewalRequestSchema = new Schema({
    itemID: { typeof: Schema.Types.ObjectId, ref: "OrderItem", required: true },
    requestUser: { typeof: Schema.Types.ObjectId, ref: "User", required: true },
    librarianID: { typeof: Schema.Types.ObjectId, ref: "User" },
    reason: { typeof: String, required: true, maxLength: 500 },
    requestExtendDate: { typeof: Date, required: true, default: Date.now },
    requestStatus: { typeof: String, required: true, enum: ["Processing", "Denided", "Accept"], default: "Processing" }
})

module.exports = mongoose.model("RenewalRequest", RenewalRequestSchema);