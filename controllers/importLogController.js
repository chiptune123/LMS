const BookModel = require("../models/books");
const UserModel = require("../models/users");
const ImportLogModel = require("../models/importLog");

const asyncHandler = require("express-async-handler");

exports.import_list = asyncHandler(async (req, res, next) => {
  try {
    const [importLogList, bookList] = await Promise.all([
      ImportLogModel.find({}).populate("managerId").populate("bookId").sort({ createdAt: 1 }).exec(),
      BookModel.find({}).sort({ title: 1 }).exec()
    ]);
    
    if (importLogList && bookList) {
      if (req.baseUrl == "/admin") {
        res.render("import_log_management", { title: "Import List", import_list: importLogList, book_list: bookList });
        return;
      }
    } else {
      res.render("errorPage", { message: "Import Logs not found", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
})

exports.import_create_get = asyncHandler(async (req, res, next) => {
  try {
    // Query bookList for import
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
      UserModel.findById(req.session.tokenUserId),
      BookModel.findById(req.body.bookId).sort({ name: 1 }),
    ]);

    if (userDetail && bookDetail) {
      const newImportLog = new ImportLogModel({
        managerId: req.session.tokenUserId,
        bookId: req.body.bookId,
        createdAt: Date.now(),
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

      await newImportLog.save();

      res.redirect("/imports");

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

exports.import_delete_get = asyncHandler(async (req, res, next) => {
  try {
    const importDetail = await ImportLogModel.findById(req.params.id);

    if (importDetail) {
      res.render("import_delete_form", { title: "Import Delete", import_detail: importDetail });
    }
  } catch (err) {
    res.render("errorPage", { message: "Import Logs not found", errorStatus: 404 });
  }
})

exports.import_delete_post = asyncHandler(async (req, res, next) => {
  try {
    const importDetail = await ImportLogModel.findByIdAndDelete(req.params.id).exec();

    if (importDetail == null) {
      res.status(404).render("errorPage", { message: "Import not found!", errorStatus: 404 });
    }

    res.redirect("/imports");

  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
})