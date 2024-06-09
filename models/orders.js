const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderStatus: {
      type: String,
      required: true,
      enum: [
        "Processing",
        "Ready for Pick Up",
        "Partially Completed",
        "Completed",
      ],
      default: "Processing",
    },
    //orderDate: { typeof: Date, required: true, default: Date.now },
    orderPreparer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      //required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);
