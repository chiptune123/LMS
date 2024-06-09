const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
    orderId: { typeof: Schema.Types.ObjectId, ref: "Order", required: true },
    bookId: { typeof: Schema.Types.ObjectIdm, ref: "Book", required: true },
    returnDeadline: { typeof: Date },
    penaltyAmount: {typeof: Number, Default: 0},
    penaltyStatus: {typeof: Boolean, default: 0},
    penaltyAmount: {typeof: double, default: 0},
    lendStatus: {typeof: Boolean, default: 0}
})

module.exports = mongoose.model('OrderItem', OrderItemSchema);