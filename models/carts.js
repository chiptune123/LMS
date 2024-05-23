const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        books: [{
            book: {type: mongoose.Schema.ObjectId, ref: "Book"},
            quantity: {type: Number, default: 1}
        }],
        active: { type: Boolean, default: true },
        modifiedOn: { type: Date, default: Date.now }

    },
    { timestamps: true }
)

module.exports = mongoose.model("Cart", CartSchema);