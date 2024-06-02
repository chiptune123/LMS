const BookModel = require("../models/books");
const UserModel = require("../models/users");
const ImportLogModel = require("../models/importLog");

const asyncHandler = require("express-async-handler");

exports.import_create_get = asyncHandler(async (req, res, next) => {
  try {
    const bookList = await BookModel.find({}).exec();
    res.render("import_create_form", {
      title: "Import create",
      book_list: bookList,
    });
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.import_create_post = asyncHandler(async (req, res, next) => {
  try {
    // Query to check if user and book exist
    const [userDetail, bookDetail] = await Promise.all([
      UserModel.findById(req.body.managerId),
      BookModel.findById(req.body.BookId).sort({ name: 1 }),
    ]);

    if (userDetail.role == "Admin" && userDetail && bookDetail) {
      const newImportLog = new ImportLogModel({
        managerId: req.body.userId,
        bookId: req.body.bookId,
        createdAt: Date.now,
        supplier: req.body.supplier,
        quantity: req.body.quantity,
      });

      let newQuantity = req.body.quantity + bookDetail.quantity;

      await BookModel.findByIdAndUpdate(
        { _id: req.body.bookId },
        {
          $set: {
            quantity: newQuantity,
          },
        }
      );
    } else {
      res.status(404).render("errorPage", {
        message: "Book or User not found",
        errorStatus: 404,
      });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});


exports.import_list = asyncHandler(async (req, res, next) => {
  try {
    const importLogList = await ImportLogModel.find({}).populate("user").populate("book").sort({ createdAt: 1 }).exec();

    if (importLogList) {
      res.render("import_list", { title: "Import List", import_list: importLogList });
    } else {
      res.render("errorPage", {message: "Import Logs not found", errorStatus: 404});
    }
  } catch (err) {
    
  }
})

exports.import_delete_post = asyncHandler(async (req, res, next ) => {
  try{
    const importDetail = await ImportLogModel.findById(req.params.id).exec();

    if(importDetail) {
      ImportLogModel.findByIdAndDelete(req.params.id);

      res.redirect("/imports");
    } else {
      res.render("errorPage", {message: "Import Logs not found", errorStatus: 404});
    }
  } catch (err) {
    res.status(500).render("errorPage", {message: err, errorStatus: 500});
  }
})