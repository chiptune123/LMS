const asyncHandler = require("express-async-handler");
const OrderModel = require("../models/orders");
const UserModel = require("../models/users");
const BookModel = require("../models/books");
const AuthorModel = require("../models/authors");
const OrderItemModel = require("../models/orderItems");
const RenewalRequestModel = require("../models/renewalRequests");
const { options } = require("../routes/authenticationRoutes");

const ORDER_MANAGEMENT_PAGE = "order_management";
const ORDER_RETURN_MANAGEMENT_PAGE = "order_return_management";
const ORDER_MANAGEMENT_PAGE_URL = "admin/dashboard/order_management";
const ORDER_DETAIL_USER_PAGE = "order_detail";
const ORDER_USER_URL = "/orders";
const ORDER_USER_PAGE = "user_order";
const PENALTY_LIST_PAGE = "penalty_list";

async function penalty_calculate(oldDate, newDate) {
  const diffTime = Math.abs(newDate - oldDate);
  const diffDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let penaltyAmount = 0;

  if (diffDay > 0 && diffDay <= 7) {
    penaltyAmont = diffDay * 1;
  } else if (diffDay > 7) {
    penaltyAmont = 7 + (diffDay * 5);
  }

  return penaltyAmount;
}

async function decrease_book_quantity_by_one(bookId) {
  await BookModel.findByIdAndUpdate({ bookId }, {
    $inc: {
      quantity: -1
    }
  })
}

async function increase_book_quantity_by_one(bookId) {
  await BookModel.findByIdAndUpdate({ bookId }, {
    $inc: {
      quantity: 1
    }
  })
}

async function getAllMonths() {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return months;
}

async function formatDataForChart(aggregatedData) {
  const textMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthData = {};

  // Initialize each month with 0
  textMonths.forEach(month => {
    monthData[month] = 0;
  });

  //*** Example Data
  // [
  //   { _id: { year: 2024, month: 6 }, totalCount: 1 },
  //   { _id: { year: 2024, month: 7 }, totalCount: 9 }
  // ]

  for (let data of aggregatedData) {
    let year = data._id.year;
    let month = data._id.month;

    // Convert month number to text
    // -1 Due to javascript date constructor uses zero-base index
    let monthText = new Date(year, month - 1).toLocaleString('en-US', { month: 'short' });
    // Check if monthText exist in monthData, if exist, add count data to that month
    if (monthData.hasOwnProperty(monthText)) {
      monthData[monthText] = data.totalCount;
    }
  }

  return {
    labels: textMonths,
    data: textMonths.map(month => monthData[month])
  }

}

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
    const orderDetail = await OrderModel.findById(req.params.orderId).populate("memberId").exec();
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
});
// Return order list based on userId
exports.order_list_by_user = asyncHandler(async (req, res, next) => {
  try {
    // *** Implement checking case if user is login
    const orderList = await OrderModel.find({ memberId: req.session.tokenUserId }).sort({ createdAt: -1 });

    // Add orderItemList property according to each order
    for (let i = 0; i < orderList.length; i++) {
      let orderItemList = await OrderItemModel.find({ orderId: orderList[i].id }).populate('bookId').exec();
      orderList[i].orderItemList = orderItemList;
    }

    if (orderList) {
      res.render("user_order", {
        title: "Your Order",
        order_list: orderList,
      });
    } else {
      res.status(404).render("errorPage", { message: "Order not found", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.order_return_by_user = asyncHandler(async (req, res, next) => {
  try {
    // *** Implement checking case if user is login
    const [orderList, userDetail] = await Promise.all([
      OrderModel.find({ simplifyId: req.body.simplifyId }).sort({ createdAt: 1 }).exec(),
      UserModel.findOne({ simplifyId: req.body.simplifyId }).exec(),
    ]);

    // Add orderItemList property according to each order
    for (let i = 0; i < orderList.length; i++) {
      let orderItemList = await OrderItemModel.find({ orderId: orderList[i].id }).populate('bookId').exec();
      orderList[i].orderItemList = orderItemList;
    }

    if (orderList) {
      res.render(ORDER_RETURN_MANAGEMENT_PAGE, {
        title: "Order History",
        order_list: orderList,
        user_detail: userDetail,
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
    const orderList = await OrderModel.find({}).populate("memberId").populate("orderPreparer").sort({ createdAt: -1 }).exec();

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
    const userDetail = await UserModel.findById(req.session.tokenUserId).exec();

    if (res.locals.loginStatus == true) {
      const newOrder = await new OrderModel({
        memberId: userDetail.id,
        simplifyId: userDetail.simplifyId,
      })

      await newOrder.save();

      let currentDate = new Date();

      // Add 1 month after the lend date for return deadline
      currentDate.setMonth(currentDate.getMonth() + 1);

      // Set the time at beginning of a day
      currentDate.setHours(0, 0, 0, 0);

      for (let i = 0; i < req.body.bookLength; i++) {
        const newOrderItem = new OrderItemModel({
          orderId: newOrder.id,
          bookId: req.body.book[i],
          quantity: req.body.book_quantity[i],
          returnDeadline: currentDate,
        })

        // Decrease book quantity by 1 when user make order
        decrease_book_quantity_by_one(req.body.book[i])

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

exports.order_detail_update_post = asyncHandler(async (req, res, next) => {
  try {
    const [orderDetail] = await Promise.all([
      OrderModel.findById(req.params.orderId).exec()
    ]);

    const formData = req.body;
    const orderId = req.body.orderId;
    const orderItemList = [];

    // Format formData to array
    for (let i = 0; i < Object.keys(formData).length; i++) {
      const statusKey = `pickupStatus${i}`;
      const orderItemIdKey = `orderItemId${i}`
      if (formData.hasOwnProperty(statusKey) && formData.hasOwnProperty(orderItemIdKey)) {
        orderItemList.push({
          index: i,
          pickupStatus: formData[statusKey],
          orderItemId: formData[orderItemIdKey],
        });
      }
    }

    // Save lend status for each book
    for (let orderItem of orderItemList) {
      await OrderItemModel.findByIdAndUpdate({ _id: orderItem.orderItemId }, {
        $set: {
          pickupStatus: orderItem.pickupStatus,
        }
      })
    }

    await OrderModel.findByIdAndUpdate({ _id: orderId }, {
      $set: {
        orderStatus: req.body.orderStatus,
        orderPreparer: req.session.tokenUserId
      }
    })

    res.redirect('back');
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
})

exports.request_extend_post = asyncHandler(async (req, res, next) => {
  const orderItemDetail = await OrderItemModel.findById(req.body.orderItemId).populate('bookId').exec();
  const requestExtendList = await RenewalRequestModel.find({ orderItemId: req.body.orderItemId }).exec();

  // Denided request if request more than 2 times
  if (requestExtendList.length >= 2) {
    const orderList = await OrderModel.find({ memberId: req.session.tokenUserId }).sort({ createdAt: -1 });

    // Add orderItemList property according to each order
    for (let i = 0; i < orderList.length; i++) {
      let orderItemList = await OrderItemModel.find({ orderId: orderList[i].id }).populate('bookId').exec();
      orderList[i].orderItemList = orderItemList;
    }

    if (orderList) {
      const errors = [];
      errors.push("Can't request extend for more than 2 times!");

      res.render(ORDER_USER_PAGE, {
        title: "Your Order",
        errors_object: errors,
        order_list: orderList,
      });
    } else {
      res.status(404).render("errorPage", { message: "Order not found", errorStatus: 404 });
    }

  }

  // Set next deadline 2 weeks after the old deadline
  let oldDeadline = orderItemDetail.returnDeadline;
  let newDeadline = new Date(oldDeadline);
  newDeadline.setDate(oldDeadline.getDate() + 14);

  if (orderItemDetail) {
    // Check book quantity before allow to extend
    let quantity = orderItemDetail.bookId.quantity;

    // If no book available, denide the request
    if (quantity == 0) {
      const RenewalRequest = new RenewalRequestModel({
        orderItemId: req.body.orderItemId,
        bookId: req.body.bookId,
        userId: req.session.tokenUserId,
        oldReturnDeadline: orderItemDetail.returnDeadline,
        requestExtendDate: newDeadline,
        requestStatus: "Denied"
      })

      await RenewalRequest.save();
      res.redirect(ORDER_USER_PAGE);
    }

    // If book available, accept the request and extended 2 weeks
    const renewalRequest = new RenewalRequestModel({
      orderItemId: req.body.orderItemId,
      bookId: req.body.bookId,
      userId: req.session.tokenUserId,
      oldReturnDeadline: orderItemDetail.returnDeadline,
      requestExtendDate: newDeadline,
      requestStatus: "Accepted"
    })

    let newPenalty = penalty_calculate(oldDeadline, newDeadline);

    // Save renewal request
    await renewalRequest.save();

    // Save the status to orderItem
    await OrderItemModel.findByIdAndUpdate(req.body.orderItemId, {
      $set: {
        returnDeadline: newDeadline,
        penaltyAmont: newPenalty,
      }
    })

    res.redirect(ORDER_USER_URL);
  }
})

exports.renewal_request_list_get = asyncHandler(async (req, res, next) => {
  try {
    const renewalRequestList = await RenewalRequestModel.find({}).populate("orderItemId").populate("bookId").populate("userId").sort({ createdAt: -1 }).exec();

    if (renewalRequestList) {
      res.render("renewal_request_management", { title: "Renewal Request", renewal_request_list: renewalRequestList });
    } else {
      res.status(404).render("errorPage", { message: "Renewal Request not found!", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
})

exports.order_return_get = asyncHandler(async (req, res, next) => {
  res.render("return_form", { title: "Order Return" });
})

exports.process_return_post = asyncHandler(async (req, res, next) => {
  try {
    const orderItemDetail = await OrderItemModel.findById(req.body.orderItemId).populate("bookId").exec();

    if (orderItemDetail) {
      // Change orderItem lend status
      await OrderItemModel.findByIdAndUpdate(req.body.orderItemId, {
        $set: {
          lendStatus: "Returned"
        }
      })

      // Increase book quantity when student return
      increase_book_quantity_by_one(orderItemDetail.bookId.id);

      const [orderList, userDetail] = await Promise.all([
        OrderModel.find({ simplifyId: req.body.simplifyId }).sort({ createdAt: 1 }).exec(),
        UserModel.findOne({ simplifyId: req.body.simplifyId }).exec(),
      ]);

      // Add orderItemList property according to each order
      for (let i = 0; i < orderList.length; i++) {
        let orderItemList = await OrderItemModel.find({ orderId: orderList[i].id }).populate('bookId').exec();
        orderList[i].orderItemList = orderItemList;
      }

      res.render(ORDER_RETURN_MANAGEMENT_PAGE, {
        title: "Order History",
        order_list: orderList,
        user_detail: userDetail,
      });

    } else {
      res.status(404).render("errorPage", { message: "Book not found!", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 })
  }
})

exports.order_item_penalty_list_get = asyncHandler(async (req, res, next) => {
  try {
    const orderItemList = await OrderItemModel.find({ lendStatus: "Overdue" }).populate("bookId").exec();

    if (orderItemList) {
      res.render(PENALTY_LIST_PAGE, {
        title: "Penalty Book",
        order_list: orderItemList
      });
    } else {
      res.status(404).render("errorPage", { message: "Order not found!", errorStatus: 404 });
    }

  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.dashboard_get = asyncHandler(async (req, res, next) => {
  try {
    const titleAmount = await BookModel.countDocuments().exec();
    const bookAmount = await BookModel.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$quantity" }
        }
      }
    ]).exec();
    const totalPenaltyAmount = await OrderItemModel.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$penaltyAmount" }
        }
      }
    ]).exec();
    const totalOrderEachMonth = await OrderModel.aggregate([
      {
        $group: {
          _id: {
            year: { "$year": "$createdAt" },
            month: { "$month": "$createdAt" }
          },
          "totalCount": { $sum: 1 }
        }
      }
    ]).exec();
    let chartData = await formatDataForChart(totalOrderEachMonth);

    const orderAmount = await OrderModel.countDocuments().exec();
    const userAmount = await UserModel.countDocuments().exec();
    const penaltyAmount = await OrderItemModel.countDocuments({ lendStatus: "Overdue" }).exec();
    const authorAmount = await AuthorModel.countDocuments().exec();
    const totalRent = await OrderItemModel.countDocuments().exec();
    const totalReturn = await OrderItemModel.countDocuments({ lendStatus: "Returned" }).exec();


    res.render("dashboard", {
      title: "Dashhboard Page",
      title_amount: titleAmount,
      book_amount: bookAmount[0].totalAmount,
      order_amount: orderAmount,
      user_amount: userAmount,
      penalty_amount: penaltyAmount,
      total_penalty_amount: totalPenaltyAmount[0].totalAmount,
      author_amount: authorAmount,
      total_rent: totalRent,
      total_return: totalReturn,
      chart_data: chartData,
    });
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
})