const mongoose = require('mongoose');

const Schema = mongoose.Schema();

const CartScema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        books: [{
            book: {type: mongoose.Schema.ObjectId, ref: "Book"},
            quantity: {type: Number, default: 1}
        }],
        active: { type: Boolean, default: true },
        modifiedOn: { type: date, default: Date.now }

    },
    { timestamps: true }
)

module.exports = mongoose.model("Cart", CartScema);