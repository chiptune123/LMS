const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ImportLogSchema = new Schema({
    managerID: {typeof: Schema.Types.ObjectId, ref: "User", required: true},
    bookID: {typeof: Schema.Types.ObjectId, ref: "Book", require: true},
    dateTaken: {typeof: Date, required: true},
    supplier: {typeof: String, required: true},
    quantity: {typeof: Number, required: true},
})

module.exports = mongoose.model("ImportLog", ImportLogSchema);