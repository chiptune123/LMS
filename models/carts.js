const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        books: {
            type: [{
                bookId: { type: Schema.Types.ObjectId, ref: "Book" },
                quantity: { type: Number, default: 1 }
            }],
            default: []
        }

        // active: { type: Boolean, default: true },
        //modifiedOn: { type: Date, default: Date.now }

    },
    { timestamps: true }
)

module.exports = mongoose.model("Cart", CartSchema);