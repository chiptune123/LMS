const asyncHandler = require("express-async-handler");
const OrderModel = require("../models/orders");
const OrderItemModel = require("../models/orderItems");
const { options } = require("../routes/authenticationRoutes");

exports.order_detail = asyncHandler(async (req, res, next) => {
  try {
    //*** Implement Check if the order belong to user, if not then return 403 denided. Admin | librarian | authentic user then allow
    const orderDetail = await OrderModel.findById(req.params.id);
    const orderItemsList = await OrderItemModel.find({ orderId: req.params.id }).populate("bookId").sort({ createdAt: 1 });

    if (orderDetail && orderItemsList) {
      if (req.baseUrl == "/admin") {
        res.render("order_detail_management", {
          title: "Order Detail",
          order_detail: orderDetail,
          order_items_list: orderItemsList
        });
      } else {}
    } else {
      res
        .status(404)
        .render("errorPage", { message: "Order not found", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

// Return order list based on userId
exports.order_list_by_user = asyncHandler(async (req, res, next) => {
  try {
    // *** Implement checking case if user is login
    const orderList = await OrderModel.find({ memberId: req.session.tokenUserId }).sort({ createdAt: 1 });

    if (orderList) {
      res.render("order_list", {
        title: "Order list",
        order_list: orderList,
      });
    } else {
      res.status(404).render("errorPage", { message: "Order not found", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.order_list = asyncHandler(async (req, res, next) => {
  try {
    const orderList = await OrderModel.find({}).populate("memberId").populate("orderPreparer").sort({ createAt: 1 }).exec();

    if (orderList) {
      if (req.baseUrl == "/admin") {
        res.render("order_management", { title: "Order Collection", order_list: orderList });
        return;
      }
      res.render("order_list", { order_list: orderList });
    } else {
      res.status(404).render("errorPage", { message: "Order list not found!", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

// *** Fix not allow to create an empty order error
exports.order_create_post = asyncHandler(async (req, res, next) => {
  try {
    //*** Fix require login before create order/
    const newOrder = await new OrderModel({
      memberId: req.session.tokenUserId
    })

    await newOrder.save();

    // Create order items with order id
    for (let i = 0; i < req.body.bookLength; i++) {
      const newOrderItem = new OrderItemModel({
        orderId: newOrder.id,
        bookId: req.body.book[i],
        quantity: req.body.book_quantity[i],
      })

      await newOrderItem.save();
    }

    // Remove cart session after checkout
    req.session.cart = null;

    res.render("thankyou_page", { title: "Thank you for your order!" });
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
})