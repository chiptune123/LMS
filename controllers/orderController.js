const asyncHandler = require("express-async-handler");
const OrderModel = require("../models/orders");
const OrderItemModel = require("../models/orderItems");
const { options } = require("../routes/authenticationRoutes");

const ORDER_MANAGEMENT_PAGE = "order_management";
const ORDER_MANAGEMENT_PAGE_URL = "admin/dashboard/order_management";
const ORDER_DETAIL_USER_PAGE = "order_detail";

exports.order_detail_return = asyncHandler(async (req, res, next) => {
  try {
    //*** Implement Check if the order belong to user, if not then return 403 denided. Admin | librarian | authentic user then allow
    //const orderDetail = await OrderModel.findById(req.params.id);
    //const orderItemsList = await OrderItemModel.find({ orderId: req.params.id }).populate("bookId").sort({ createdAt: 1 });

    // Find the lastest order item with ISBN
    const orderItemDetail = await OrderItemModel.find({ uniqueBarcode: req.params.uniqueBarcode }).sort({ _id: -1 }).limit(1).exec();
    // Get the order ID from latest order item
    const IdOfOrder = orderItemDetail.orderId;

    // Find all orderItem and order detail
    const orderItemList = await OrderItemModel.find({ orderId: IdOfOrder }).populate("bookId").exec();
    const orderDetail = await OrderModel.findById()

    if (orderDetail && orderItemsList) {
      if (req.baseUrl == "/admin") {
        res.render("order_detail_management", {
          title: "Order Detail",
          order_detail: orderDetail,
          order_item_list: orderItemList
        });
      }
    } else {
      res
        .status(404)
        .render("errorPage", { message: "Order not found", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.order_detail = asyncHandler(async (req, res, next) => {
  try {
    //*** Implement Check if the order belong to user, if not then return 403 denided. Admin | librarian | authentic user then allow
    const orderDetail = await OrderModel.findById(req.params.orderId);
    const orderItemList = await OrderItemModel.find({ orderId: req.params.orderId }).populate("bookId").sort({ createdAt: 1 });

    if (orderDetail && orderItemList) {
      if (req.baseUrl == "/admin") {
        res.render("order_detail_management", {
          title: "Order Detail",
          order_detail: orderDetail,
          order_item_list: orderItemList
        });
      } else {
        res.render(ORDER_DETAIL_USER_PAGE, {
          title: "Order Detail",
          order_detail: orderDetail,
          order_item_list: orderItemList
        });
      }
    } else {
      res
        .status(404)
        .render("errorPage", { message: "Order not found", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }

  try {
    const orderDetail = await OrderModel.find({ id: req.params.orderId });

    if (orderDetail) {
      const orderItemList = await OrderItemModel.find({ orderId: req.params.orderId });

      res.render("ORDER_MANAGEMENT_PAGE", {
        title: "Order Items",
        order_item_list: orderItemList,
        order_detail: orderDetail,
      })
    } else {
      res.status(404).render("errorPage", { message: "Order Not Found", errorStatus: 404 });
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

exports.order_return_get = asyncHandler(async (req, res, next) => {
  try {
    res.render("order_return", { title: "Order Return" });
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

// *** Fix not allow to create an empty order error
exports.order_create_post = asyncHandler(async (req, res, next) => {
  try {
    // If user not login then render login page
    if (res.locals.loginStatus == true) {
      const newOrder = await new OrderModel({
        memberId: req.session.tokenUserId
      })

      await newOrder.save();

      let currentDate = new Date();

      // Add 1 month after the lend date for return deadline
      currentDate.setMonth(currentDate.getMonth() + 1);

      // Set the time at beginning of a day
      currentDate.setHours(0, 0, 0, 0);

      // Create order items with order id
      for (let i = 0; i < req.body.bookLength; i++) {
        const newOrderItem = new OrderItemModel({
          orderId: newOrder.id,
          bookId: req.body.book[i],
          quantity: req.body.book_quantity[i],
          returnDeadline: currentDate,
        })

        await newOrderItem.save();
      }

      // Remove cart session after checkout
      req.session.cart = null;

      res.render("thankyou_page", { title: "Thank you for your order!" });
      return next();
    } else {
      res.redirect("/auth/login");
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
})

exports.order_delete_post = asyncHandler(async (req, res, next) => {
  try {
    const orderDetail = OrderModel.findById(req.params.orderId);

    // Changed deleteStatus to true when delete
    if (orderDetail) {
      await OrderModel.findByIdAndUpdate(req.params.orderId, {
        $set: {
          deleteStatus: true,
        }
      })

      res.redirect(ORDER_MANAGEMENT_PAGE_URL);
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.order_item_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not Implement")
})