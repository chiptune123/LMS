const BookModel = require("../models/books");
const AuthorModel = require("../models/authors");
const SubjectModel = require("../models/subjects");

const asyncHandler = require("express-async-handler");

exports.book_list = asyncHandler(async (req, res, next) => {
  try {
    const allBooks = await BookModel.find().sort({ title: 1 }).exec();

    if (allBooks) {
      res.render("book_list", { title: "Book List", book_list: allBooks });
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
    const bookDetail = await BookModel.findById(req.params.id).exec();

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
    res.render("book_create_form", { title: "Book Create" });
  } catch (err) {
    res.status(500).render("errorPage", { message: err });
  }
});

exports.book_create_post = asyncHandler(async (req, res, next) => {
  // Check ISBN if book is exist
  try {
    const bookDetail = await BookModel.find({
      ISBN_thirteenDigits: req.body.bookISBN_thirteenDigits,
      ISBN_tenDigits: req.body.bookISBN_tenDigits,
    }).exec();

    const newBook = new BookModel({
      title: req.body.bookTitle,
      author: req.body.bookAuthor,
      subject: req.body.bookSubject,
      description: req.body.bookDescription,
      publisher: req.body.publisher,
      publish_date: req.body.publish_date,
      page_numbers: req.body.page_numbers,
      price: req.body.price,
      quantity: req.body.quantity,
      ISBN_tenDigits: req.body.bookISBN_tenDigits,
      ISBN_thirteenDigits: req.body.bookISBN_thirteenDigits,
      coverPicturePath: req.body.coverPicturePath,
      uniqueBarcode: req.body.bookUniqueBarcode,
    });

    if (bookDetail) {
      res.status(500).render("book_create_form", {
        err: "Book already exist",
        title: "Book Create",
        book_detail: bookDetail,
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
    const bookDetail = BookModel.findById(req.params.id);

    if (bookDetail) {
      res.render("book_update_form", {
        title: "Book Update",
        book_detail: bookDetail,
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
          title: req.body.bookTitle,
          author: req.body.bookAuthor,
          subject: req.body.bookSubject,
          description: req.body.bookDescription,
          publisher: req.body.publisher,
          publish_date: req.body.publish_date,
          page_numbers: req.body.page_numbers,
          price: req.body.price,
          quantity: req.body.quantity,
          ISBN_tenDigits: req.body.bookISBN_tenDigits,
          ISBN_thirteenDigits: req.body.bookISBN_thirteenDigits,
          coverPicturePath: req.body.coverPicturePath,
          uniqueBarcode: req.body.bookUniqueBarcode,
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
      res.render("book_delete_form", { title: "Book Delete", book_detail: bookDetail });
    } else {
      res.status(404).render("errorPage", { message: "Book not found", errorStatus: 500 });
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
      res.status(404).render("errorPage", { message: "Books not found!", errorStatus: 404 });
    }

  } catch (err) {
    res.status(500).render("errorPage", { message: "Books not found!", errorStatus: 404 });
  }
});
