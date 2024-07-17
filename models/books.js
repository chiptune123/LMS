const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: { type: String, required: true, maxLength: 100 },
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    description: { type: String, required: true, maxLength: 1000 },
    publisher: {type: String, required: true, maxLength:100},
    publish_date: { type: Date, required: true },
    page_numbers: {type: Number, required: true},
    quantity: {type: Number, required: true},
    ISBN_tenDigits: {type: String, required: true},
    ISBN_thirteenDigits: {type: String, required: true},
    coverPicturePath: {type: String, maxLength: 500},
    uniqueBarcode: {type: String, required: true, maxLength: 200},
    rating: {type: Number, default: 0},
    status: {
        type: String,
        required: true,
        enum: [
          "Available",
          "Unavailable",
        ],
        default: "Available",
      },

})

BookSchema.virtual('ratingIntegralPart').get(function() {
    return Math.floor(this.rating);
})

BookSchema.virtual('ratingFractionalPart').get(function() {
    return this.rating % 1;
})
module.exports = mongoose.model("Book", BookSchema);