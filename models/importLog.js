const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ImportLogSchema = new Schema(
  {
    managerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", require: true },
    supplier: { type: String, required: true },
    quantity: { type: Number, required: true },
    deleteStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImportLog", ImportLogSchema);
