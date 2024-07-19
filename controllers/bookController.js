const BookModel = require("../models/books");
const AuthorModel = require("../models/authors");
//const SubjectModel = require("../models/subjects");
const CartModel = require("../models/carts");

const asyncHandler = require("express-async-handler");
//const { request } = require("../app");

const SAME_UNIQUE_BARCODE_ERROR = "A book with same barcode already existed";
const BOOK_MANAGEMENT_PAGE = "/admin/dashboard/book_management";

exports.book_list = asyncHandler(async (req, res, next) => {
  try {
    const [authorList, allBooks, subjectList] = await Promise.all(
      [AuthorModel.find({}, "name").sort({ title: 1 }).exec(),
      BookModel.find().populate("author").sort({ title: 1 }).exec(),
        //SubjectModel.find({}, "name").sort({ name: 1 }).exec(),
      ]);

    // Create an empty session if there are no items in cart
    if (!req.session.cart) {
      req.session.cart = [];
      req.session.createAt = Date.now;
    }

    if (allBooks) {
      if (req.baseUrl == "/admin") {
        res.render("book_management", {
          title: "Book Collection",
          book_list: allBooks,
          author_list: authorList,
          //subject_list: subjectList,
          cart: req.session.cart,
        });
        return;
      }
      res.render("book_list", {
        title: "Book Collection",
        book_list: allBooks,
        author_list: authorList,
        cart: req.session.cart,
      });
      return;
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
    const bookDetail = await BookModel.findById(req.params.bookId)
      .populate("author")
      // .populate("subject")
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

exports.book_create_post = asyncHandler(async (req, res, next) => {
  try {
    // Check barcode if book is existed
    const duplicateBookList = await BookModel.find({
      uniqueBarcode: req.body.bookUniqueBarcode,
    }).populate("author").exec();
    const authorList = await AuthorModel.find({}, "name").sort({ name: 1 }).exec();
    const bookList = await BookModel.find({}).populate("author").sort({ title: 1 }).exec();

    const newBook = new BookModel({
      title: req.body.bookTitle,
      author: req.body.authorId,
      description: req.body.bookDescription,
      publisher: req.body.bookPublisher,
      publish_date: req.body.bookPublishDate,
      page_numbers: req.body.bookPageNumber,
      quantity: req.body.bookQuantity,
      ISBN_tenDigits: req.body.bookISBNTenDigits,
      ISBN_thirteenDigits: req.body.bookISBNThirteenDigits,
      coverPicturePath: req.body.bookCoverPicturePath,
      uniqueBarcode: req.body.bookUniqueBarcode,
      status: req.body.bookStatus
    });

    if (duplicateBookList.length > 0) {
      const errors = [];
      errors.push(SAME_UNIQUE_BARCODE_ERROR);
      console.log(errors);

      res.status(409).render("book_management", {
        errors_object: errors,
        title: "Book Collection",
        duplicate_book_list: duplicateBookList,
        author_list: authorList,
        book_list: bookList,
      });
    } else {
      await newBook.save();
      res.redirect("/admin/dashboard/book_management");
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.book_update_post = asyncHandler(async (req, res, next) => {
  try {

    oldBook = await BookModel.findById({ _id: req.params.bookId })
    const newUniqueBarcode = req.body.bookUniqueBarcode;

    // If new unique barcode equal oldBook barcode
    if (newUniqueBarcode == oldBook.uniqueBarcode) {
      await BookModel.findByIdAndUpdate(
        { _id: req.params.bookId },
        {
          $set: {
            title: req.body.bookTitle,
            author: req.body.authorId,
            description: req.body.bookDescription,
            publisher: req.body.bookPublisher,
            publish_date: req.body.bookPublishDate,
            page_numbers: req.body.bookPageNumber,
            quantity: req.body.bookQuantity,
            ISBN_tenDigits: req.body.ISBNTenDigits,
            ISBN_thirteenDigits: req.body.ISBNThirteenDigits,
            coverPicturePath: req.body.bookCoverPicturePath,
            uniqueBarcode: req.body.bookUniqueBarcode,
          },
        }
      );
      res.redirect("/admin/dashboard/book_management");
      return next();
    }

    const duplicateBookList = await BookModel.find({uniqueBarcode: newUniqueBarcode}).exec();
    // If newUniqueBarcode duplicate with other book
    if (duplicateBookList.length > 0) {
      const errors = [];
      errors.push(SAME_UNIQUE_BARCODE_ERROR);
      const [bookList, authorList] = await Promise.all([
        BookModel.find({}).populate("author").sort({ title: 1 }).exec(),
        AuthorModel.find({}).sort({ name: 1 })
      ])

      res.render("book_management", {
        title: "Book Collection",
        errors_object: errors,
        book_list: bookList,
        author_list: authorList,
      })
    } else {
      // newUniqueBarcode is unique and has no duplicate book
      await BookModel.findByIdAndUpdate(
        { _id: req.params.bookId },
        {
          $set: {
            title: req.body.bookTitle,
            author: req.body.authorId,
            description: req.body.bookDescription,
            publisher: req.body.bookPublisher,
            publish_date: req.body.bookPublishDate,
            page_numbers: req.body.bookPageNumber,
            quantity: req.body.bookQuantity,
            ISBN_tenDigits: req.body.ISBNTenDigits,
            ISBN_thirteenDigits: req.body.ISBNThirteenDigits,
            coverPicturePath: req.body.bookCoverPicturePath,
            uniqueBarcode: req.body.bookUniqueBarcode,
          },
        }
      );
      res.redirect("/admin/dashboard/book_management");
      return next();
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.book_delete_post = asyncHandler(async (req, res, next) => {
  try {
    const bookDetail = await BookModel.findById(req.params.bookId);

    if (bookDetail) {
      await BookModel.findByIdAndDelete(req.params.bookId);

      res.redirect(BOOK_MANAGEMENT_PAGE);
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

