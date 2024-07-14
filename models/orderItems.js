const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    uniqueBarcode: {type: String, required: true, maxLength: 200},
    returnDeadline: { type: Date },
    penaltyAmount: {type: Number, Default: 0},
    //penaltyStatus: {type: Boolean, default: 0},
    lendStatus: {
        type: String,
        enum: ["Borrowed", "Returned", "Overdue"],
        default: "Borrowed"
    },
    quantity: {type: Number, default: 1},
})

module.exports = mongoose.model('OrderItem', OrderItemSchema);