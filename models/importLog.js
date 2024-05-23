const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ImportLogSchema = new Schema(
  {
    managerId: { typeof: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { typeof: Schema.Types.ObjectId, ref: "Book", require: true },
    dateTaken: { typeof: Date, required: true },
    supplier: { typeof: String, required: true },
    quantity: { typeof: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImportLog", ImportLogSchema);
