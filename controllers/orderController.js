const asyncHandler = require("express-async-handler");
const OrderModel = require("../models/orders");
const OrderItemModel = require("../models/orderItems");
const { options } = require("../routes/authenticationRoutes");

exports.order_detail = asyncHandler(async (req, res, next) => {
  try {
    const orderDetail = await OrderModel.findById(req.params.id);
    const orderItemsList = await OrderItemModel.find({id: req.params.id}).populate("bookId", sort({title: 1}));

    if (orderDetail) {
      res.render("order_detail", {
        title: "Order Detail",
        order_detail: orderDetail,
        order_items_list: orderItemsList
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

exports.order_list = asyncHandler(async (req, res, next) => {
  try{
    const orderList = await OrderModel.find({memberId: req.session.tokenUserId}).sort({createAt: 1});

    if(orderList) {
      res.render("order_list", {title: "Order List", order_list: orderList});
    }

  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
})

exports.order_create_post = asyncHandler(async (req, res, next) => {
  try{
    const newOrder = new OrderModel ({
      memberId: req.body.memberId,
    })

    await newOrder.save();

    // Save each item to a seperate OrderItems table
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