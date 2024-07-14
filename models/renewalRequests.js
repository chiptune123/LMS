const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RenewalRequestSchema = new Schema(
    {
        orderItemId: { typeof: Schema.Types.ObjectId, ref: "OrderItem", required: true },
        requestUser: { typeof: Schema.Types.ObjectId, ref: "User", required: true },
        librarianId: { typeof: Schema.Types.ObjectId, ref: "User", default: "" },
        reason: { typeof: String, required: true, maxLength: 500 },
        requestExtendDate: { typeof: Date, required: true, default: Date.now },
        requestStatus: { typeof: String, required: true, enum: ["Processing", "Denided", "Accept"], default: "Processing" }
    },
    { timestamps: true });

module.exports = mongoose.model("RenewalRequest", RenewalRequestSchema);