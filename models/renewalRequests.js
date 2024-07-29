const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RenewalRequestSchema = new Schema(
    {
        orderItemId: { type: Schema.Types.ObjectId, ref: "OrderItem", required: true },
        bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        oldReturnDeadline: { type: Date, require: true },
        requestExtendDate: { type: Date, required: true },
        requestStatus: { type: String, required: true, enum: ["Denided", "Accepted"] }
    },
    { timestamps: true });

module.exports = mongoose.model("RenewalRequest", RenewalRequestSchema);