const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
    orderID: { typeof: Schema.Types.ObjectId, ref: "Order", required: true },
    bookID: { typeof: Schema.Types.ObjectIdm, ref: "Book", required: true },
    returnDate: { typeof: Date, required: true },
    penaltyAmount: {typeof: Number, Default: 0},
    penaltyStatus: {typeof: Boolean, default: 0},
    lendStatus: {typeof: Boolean, default: 0}
})

module.exports = mongoose.model('OrderItem', OrderItemSchema);