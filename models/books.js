const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: { typeof: String, required: true, maxLength: 100 },
    author: { typeof: Schema.Types.ObjectId, ref: "Author", required: true },
    subject: { typeof: Schema.Types.ObjectId, ref: "Subject", require: true },
    description: { typeof: String, required: true, maxLength: 500 },
    publisher: {typeof: String, required: true, maxLength:100},
    publish_date: { type: Date, required: true },
    page: {typeof: Number, required: true},
    price: {typeof: Number, required: true},
    quantity: {typeof: Number, require: true},
    last_lend_date: {typeof: Date},
    ISBN_tenDigits: {typeof: String, required: true},
    ISBN_thirteenDigits: {typeof: String, required: true},
    coverPicturePath: {typeof: String, maxLength: 500},
    uniqueBarcode: {typeof: String, required: true, maxLength: 200},
    comments: [
        {
            memberID: {typeof: Schema.Types.ObjectId, ref: "User", required: true},
            textComment: {typeof: String, maxLength: 500},
            deleteStatus: {typeof: Boolean, default: false},
            deleteReason: {typeof: String, maxLength: 500},
            editorID: {typeof: Schema.Types.ObjectId, ref: "User"},
            rating: {typeof: Number},
            date: {typeof: Date, required: true},
            isEdited: {typeof: Boolean},
        }
    ]
})

module.exports = mongoose.model("Book", BookSchema);