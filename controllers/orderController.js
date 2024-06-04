const asyncHandler = require("express-async-handler");
const OrderModel = require("../models/orders");

exports.order_detail = asyncHandler(async (req, res, next) => {
  try {
    const orderDetail = OrderModel.findById(req.params.id);

    if (orderDetail) {
      res.render("order_detail", {
        title: "Order Detail",
        order_detail: orderDetail,
      });
    } else {
      res
        .status(404)
        .render("errorPage", { message: "Order not found", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});
