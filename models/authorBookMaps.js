const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorBookMapSchema = new Schema({
    author: {typeof: Schema.Types.ObjectId, ref: "Author", required:true},
    book: {typeof: Schema.Types.ObjectId, ref: "Book", required: true}
})

module.exports = mongoose.model("AuthorBookMap", AuthorBookMapSchema);