const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ImportLogSchema = new Schema(
  {
    managerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", require: true },
    dateTaken: { type: Date, required: true },
    supplier: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImportLog", ImportLogSchema);
