const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    returnDeadline: { type: Date },
    penaltyAmount: { type: Number, Default: 0 },
    lendStatus: {
        type: String,
        enum: ["Borrowed", "Returned", "Overdue"],
        default: "Borrowed"
    },
    pickupStatus: {
        type: String,
        enum: ["Ready", "Not Ready", "Completed"],
        default: "Not Ready",
    },
    quantity: { type: Number, default: 1 },
})

module.exports = mongoose.model('OrderItem', OrderItemSchema);