const asyncHandler = require("express-async-handler");
const OrderModel = require("../models/orders");
const OrderItemModel = require("../models/orderItems");

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


exports.order_create_post = asyncHandler(async (req, res, next) => {
  try{
    const newOrder = new OrderModel ({
      memberId: req.body.memberId,
    })

    await newOrder.save();

    for(let i = 0; i < req.session.cart.length; i++) {
      const newOrderItem = new OrderItemModel ({
        orderId: newOrder.id,
        bookId: req.session.cart.bookId[i],
      })

      await newOrderItem.save();
    }

    res.render("thankyou_page", {title: "Thank you for your order!"});
  } catch (err){
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
})