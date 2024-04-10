const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: { type: String, required: true, maxLength: 100 },
    author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    description: { type: String, required: true, maxLength: 500 },
    publisher: {type: String, required: true, maxLength:100},
    publish_date: { type: Date, required: true },
    page: {type: Number, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    last_lend_date: {type: Date},
    ISBN_tenDigits: {type: String, required: true},
    ISBN_thirteenDigits: {type: String, required: true},
    coverPicturePath: {type: String, maxLength: 500},
    uniqueBarcode: {type: String, required: true, maxLength: 200},
    comments: [
        {
            memberID: {type: Schema.Types.ObjectId, ref: "User", required: true},
            textComment: {type: String, maxLength: 500},
            deleteStatus: {type: Boolean, default: false},
            deleteReason: {type: String, maxLength: 500},
            editorID: {type: Schema.Types.ObjectId, ref: "User"},
            rating: {type: Number},
            date: {type: Date, required: true},
            isEdited: {type: Boolean},
        }
    ]
})

module.exports = mongoose.model("Book", BookSchema);