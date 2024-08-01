const BookModel = require("../models/books");
const AuthorModel = require("../models/authors");
//const SubjectModel = require("../models/subjects");
const CartModel = require("../models/carts");

const asyncHandler = require("express-async-handler");

const CART_PAGE = "/carts";
//const { request } = require("../app");

async function save_cart_to_db(sessionCart, sessionUserId) {
  // Upsert: true create the object if it doesn't exist
  await CartModel.findOneAndUpdate(
    { userId: sessionUserId },
    {
      $set: {
        userId: sessionUserId,
        books: sessionCart,
        updatedAt: new Date(),
      }
    },
    {
      upsert: true,
    })
}

// This function find the position of book in cart
async function index_of_book(sessionCart, searchBookId) {
  for (let i = 0; i < sessionCart.length; i++) {
    if (sessionCart[i].bookId == searchBookId) {
      return i;
    }
  }
  return -1;
}


exports.add_cart_post = asyncHandler(async (req, res, next) => {
  try {
    // Check if book is exist in database
    const bookDetail = await BookModel.findById(req.body.bookId).exec();
    const bookQuantity = Number(req.body.quantity);
    let isBookInCart = false;

    if (bookDetail) {
      // If book already exist in cart, +1 quantity and redirect to carts page
      for (let i = 0; i < req.session.cart.length; i++) {
        if (req.session.cart[i].bookId == req.body.bookId) {
          req.session.cart[i].quantity = Number(req.session.cart[i].quantity) + bookQuantity;
          req.session.updatedAt = new Date();

          // If login, save session cart to db
          if (res.locals.loginStatus == true) {
            save_cart_to_db(req.session.cart, req.session.tokenUserId);
          }

          return res.redirect("/carts");
        }
      }
      let cart = {
        bookId: req.body.bookId,
        quantity: bookQuantity,
      }
      req.session.cart.push(cart);
      req.session.updateAt = new Date();

      // If login, save session cart to db
      if (res.locals.loginStatus == true) {
        save_cart_to_db(req.session.cart, req.session.tokenUserId);
      }
      return res.redirect("/carts");
    } else {
      res
        .status(404)
        .render("errorPage", { message: "Book ID invalid", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.cart_detail_get = asyncHandler(async (req, res, next) => {
  try {
    const arrayBookId = [];
    let orderTotalPrice = 0;
    let orderTotalQuantity = 0;

    if (req.session.cart.length > 0) {
      // Push all books in session to create an array
      for (let i = 0; i < req.session.cart.length; i++) {
        arrayBookId.push(req.session.cart[i].bookId);
      }

      const cartData = req.session.cart;
      console.log(arrayBookId[0]);
      console.log(cartData[0].bookId);
      // Verify if all books exist in database
      const bookList = await BookModel.find({ _id: { $in: arrayBookId } })
        .populate("author")
        .exec();

      // Assign user's book quantity to bookList
      for (let i = 0; i < bookList.length; i++) {
        for (let j = 0; j < req.session.cart.length; j++) {
          if (bookList[i].id == req.session.cart[j].bookId) {
            bookList[i].quantity = req.session.cart[j].quantity;
          }
        }
      }

      for (let i = 0; i < bookList.length; i++) {
        bookList[i].bookTotalPrice = bookList[i].price * bookList[i].quantity;
        //orderTotalPrice = orderTotalPrice + (bookList[i].quantity * bookList[i].price);
        orderTotalQuantity = orderTotalQuantity + bookList[i].quantity;
      }
      res.render("cart", {
        title: "Cart Detail",
        book_list: bookList,
        order_total_price: orderTotalPrice,
        order_total_quantity: orderTotalQuantity
        //cart: req.session.cart,
      });
    } else {
      res.render("cart", {
        title: "Cart Detail",
        book_list: [],
        order_total_price: orderTotalPrice,
        order_total_quantity: orderTotalQuantity,
      })
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.remove_from_cart_post = asyncHandler(async (req, res, next) => {
  bookId = req.body.bookId;
  let bookIndex = index_of_book(req.session.cart, bookId);

  // Remove session book 
  req.session.cart.splice(bookIndex, 1);

  // If login, replace new session data to db
  if (res.locals.loginStatus == true) {
    save_cart_to_db(req.session.cart, req.session.tokenUserId);
  }

  res.redirect(CART_PAGE);
});
