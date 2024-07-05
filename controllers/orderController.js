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
    const UserOrderList = await OrderModel.find({memberId: req.session.tokenUserId}).sort({createAt: 1}).exec();
    //const orders = await OrderModel.find({}).exec();

    //console.log(UserOrderList);

    const allOrderItemsList = [];

    for(let i = 0; i < UserOrderList.length; i++) {
      const eachOrderItemsList = await OrderItemModel.find({orderId: UserOrderList[i].id});
      //console.log(UserOrderList[i].id);
      allOrderItemsList.push(eachOrderItemsList);
    }

    //console.log(allOrderItemsList);

    if(orderList) {
      res.render("order_list", {title: "Order List"});
    }

  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
})

// ***Fix not allow to create an empty order error
exports.order_create_post = asyncHandler(async (req, res, next) => {
  try{
    const newOrder = new OrderModel ({
      memberId: req.session.tokenUserId,
    })
    // Save order
    await newOrder.save();

    // Save each items according to order
    for(let i = 0; i < req.body.bookLength; i++) {
      const newOrderItem = new OrderItemModel({
        orderId: newOrder.id,
        bookId: req.body.book`${i}_id`,
        quantity: req.body.book`${i}_quantity`,
      })

      newOrderItem.save();
    }
    
    // for(let i = 0; i < req.session.cart.length; i++) {
    //   const newOrderItem = new OrderItemModel ({
    //     orderId: newOrder.id,
    //     bookId: req.session.cart.bookId[i],
    //   })

    //   await newOrderItem.save();
    // }

    res.render("thankyou_page", {title: "Thank you for your order!"});
  } catch (err){
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
})