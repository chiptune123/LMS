const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    memberID: { typeof: Schema.Types.ObjectId, ref: "User", required: true },
    orderStatus: { typeof: String, required: true, enum: ["Processing", "Ready for Pick Up", "Partially Completed", "Completed"], default: "Processing" },
    orderDate: { typeof: Date, required: true, default: Date.now },
    orderPreparer: {typeof: Schema.Types.ObjectId, ref: "User", required: true}
})

module.exports = mongoose.model("Order", OrderSchema);