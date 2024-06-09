const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    returnDeadline: { type: Date },
    penaltyAmount: {type: Number, Default: 0},
    penaltyStatus: {type: Boolean, default: 0},
    penaltyAmount: {type: Number, default: 0},
    lendStatus: {type: Boolean, default: 0}
})

module.exports = mongoose.model('OrderItem', OrderItemSchema);