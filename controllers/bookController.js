const BookModel = require("../models/books");
const AuthorModel = require("../models/authors");
const SubjectModel = require("../models/subjects");
const CartModel = require("../models/carts");

const asyncHandler = require("express-async-handler");
//const { request } = require("../app");

exports.book_list = asyncHandler(async (req, res, next) => {
  try {
    const allBooks = await BookModel.find()
      .populate("author")
      .populate("subject")
      .sort({ title: 1 })
      .exec();

    // Create an empty session if there are no items in cart
    if (!req.session.cart) {
      req.session.cart = [];
      req.session.createAt = Date.now;
    }

    if (allBooks) {
      res.render("book_list", {
        title: "Book Collection",
        book_list: allBooks,
        cart: req.session.cart,
      });
    } else {
      res
        .status(404)
        .render("errorPage", { message: "No Book Found", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.book_detail = asyncHandler(async (req, res, next) => {
  try {
    const bookDetail = await BookModel.findById(req.params.id)
      .populate("author")
      .populate("subject")
      .exec();

    if (bookDetail) {
      res.render("book_detail", {
        title: "Book Detail",
        book_detail: bookDetail,
      });
    } else {
      res
        .status(404)
        .render("errorPage", { message: "No Book Found", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.book_create_get = asyncHandler(async (req, res, next) => {
  try {
    const [authorList, subjectList] = await Promise.all([
      AuthorModel.find({}, "name").sort({ title: 1 }).exec(),
      SubjectModel.find({}, "name").sort({ name: 1 }).exec(),
    ]);
    res.render("book_create_form", {
      title: "Book Create",
      author_list: authorList,
      subject_list: subjectList,
    });
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.book_create_post = asyncHandler(async (req, res, next) => {
  // Check ISBN if book is exist
  try {
    const bookDetail = await BookModel.find({
      ISBN_thirteenDigits: req.body.bookISBN_thirteenDigits,
      ISBN_tenDigits: req.body.bookISBN_tenDigits,
    }).exec();
    const [authorList, subjectList] = await Promise.all([
      AuthorModel.find({}, "name").sort({ title: 1 }).exec(),
      SubjectModel.find({}, "name").sort({ name: 1 }).exec(),
    ]);

    const newBook = new BookModel({
      title: req.body.title,
      author: req.body.authors,
      subject: req.body.subjects,
      description: req.body.description,
      publisher: req.body.publisher,
      publish_date: req.body.publishDate,
      page_numbers: req.body.pageNumber,
      price: req.body.price,
      quantity: req.body.quantity,
      ISBN_tenDigits: req.body.ISBN_tenDigits,
      ISBN_thirteenDigits: req.body.ISBN_thirteenDigits,
      coverPicturePath: req.body.coverPicturePath,
      uniqueBarcode: req.body.uniqueBarcode,
      rating: req.body.rating,
    });

    if (bookDetail == null) {
      res.status(500).render("book_create_form", {
        err: "Book already exist",
        title: "Book Create",
        book_detail: bookDetail,
        author_list: authorList,
        subject_list: subjectList,
      });
    } else {
      await newBook.save();
      res.redirect("/books");
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.book_update_get = asyncHandler(async (req, res, next) => {
  try {
    // const bookDetail = BookModel.findById(req.params.id);
    const [bookDetail, subjectList, authorList, subjectDetail, AuthorDetail] =
      await Promise.all([
        BookModel.findById(req.params.id)
          .populate("author")
          .populate("subject")
          .exec(),
        SubjectModel.find({}, "name").sort({ name: 1 }).exec(),
        AuthorModel.find({}, "name").sort({ name: 1 }).exec(),
      ]);

    if (bookDetail) {
      res.render("book_update_form", {
        title: "Book Update",
        book_detail: bookDetail,
        subject_list: subjectList,
        author_list: authorList,
      });
    } else {
      res
        .status(404)
        .render("errorPage", { message: "Book Not Found", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.book_update_post = asyncHandler(async (req, res, next) => {
  try {
    await BookModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          author: req.body.authors,
          subject: req.body.subjects,
          description: req.body.description,
          publisher: req.body.publisher,
          publish_date: req.body.publishDate,
          page_numbers: req.body.pageNumber,
          price: req.body.price,
          quantity: req.body.quantity,
          ISBN_tenDigits: req.body.ISBN_tenDigits,
          ISBN_thirteenDigits: req.body.ISBN_thirteenDigits,
          coverPicturePath: req.body.coverPicturePath,
          uniqueBarcode: req.body.uniqueBarcode,
        },
      }
    );

    res.redirect("/books");
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.book_delete_get = asyncHandler(async (req, res, next) => {
  try {
    const bookDetail = await BookModel.findById(req.params.id);

    if (bookDetail) {
      res.render("book_delete_form", {
        title: "Book Delete",
        book_detail: bookDetail,
      });
    } else {
      res
        .status(404)
        .render("errorPage", { message: "Book not found", errorStatus: 500 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.book_delete_post = asyncHandler(async (req, res, next) => {
  try {
    const bookDetail = await BookModel.findById(req.params.id);

    if (bookDetail) {
      await BookModel.findByIdAndDelete(req.params.id);

      res.redirect("/books");
    } else {
      res
        .status(404)
        .render("errorPage", { message: "Books not found!", errorStatus: 404 });
    }
  } catch (err) {
    res
      .status(500)
      .render("errorPage", { message: "Books not found!", errorStatus: 404 });
  }
});

exports.add_cart_post = asyncHandler(async (req, res, next) => {
  try {
    // Check if book is exist in database
    const bookDetail = await BookModel.findById(req.body.BookId);
    const bookQuantity = Number(req.body.quantity);
    let isBookInCart = false;

    if (bookDetail) {
      //const quantity = req.body.quantity;

      if (req.session.cart.length == 0) {
        let cart = {
          BookId: req.body.BookId,
          Quantity: bookQuantity,
        }
        req.session.cart.push(cart);
        //req.session.createAt = Date.now,
        req.session.updateAt = Date.now;
      } else {
        for (let i = 0; i < req.session.cart.length; i++) {
          if (req.session.cart[i].BookId == req.body.BookId) {
            req.session.cart[i].Quantity = Number(req.session.cart[i].Quantity) + bookQuantity;
            req.session.updateAt = Date.now;
          }
        }
      }
      res.redirect("/carts");
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

    console.log(req.session.cart);

    // Push all books in cart to create an array
    for (let i = 0; i < req.session.cart.length; i++) {
      arrayBookId.push(req.session.cart[i].BookId);
    }


    const bookList = await BookModel.find({ _id: { $in: arrayBookId } })
      .populate("author")
      .populate("subject")
      .exec();

    // Assign user's book quantity to bookList
    for (let i = 0; i < bookList.length; i++) {
      for (let j = 0; j < req.session.cart.length; j++) {
        if (bookList[i].id == req.session.cart[j].BookId) {
          bookList[i].quantity = req.session.cart[j].Quantity;
        }
      }
    }

    for(let i = 0; i < bookList.length; i++) {
      bookList[i].bookTotalPrice = bookList[i].price * bookList[i].quantity;
      orderTotalPrice = orderTotalPrice + (bookList[i].quantity * bookList[i].price);
      orderTotalQuantity = orderTotalQuantity + bookList[i].quantity;
    }
    res.render("cart", {
      title: "Cart Detail",
      book_list: bookList,
      order_total_price: orderTotalPrice,
      order_total_quantity: orderTotalQuantity
      //cart: req.session.cart,
    });
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.remove_from_cart_post = asyncHandler(async (req, res, next) => {
  res.send("WIP");
});
