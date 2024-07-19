const BookModel = require("../models/books");
const UserModel = require("../models/users");
const ImportLogModel = require("../models/importLog");

const asyncHandler = require("express-async-handler");
const importLog = require("../models/importLog");

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

exports.import_create_post = asyncHandler(async (req, res, next) => {
  try {
    // Query to check if user and book exist
    const userId = req.session.tokenUserId
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

      let newQuantity = Number(req.body.quantity) + bookDetail.quantity;

      // Update new quantity after import
      await BookModel.findByIdAndUpdate(
        { _id: req.body.bookId },
        {
          $set: {
            quantity: newQuantity,
          },
        }
      );

      await newImportLog.save();

      res.redirect("/admin/dashboard/import_log_management");

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

exports.import_update_post = asyncHandler(async (req, res, next) => {
  try {
    const [importLogDetail, bookDetail] = await Promise.all([
      ImportLogModel.findById(req.params.importLogId).populate("bookId").exec(),
      BookModel.findById(req.body.bookId).exec(),
    ]);
    
    if (importLogDetail && bookDetail) {

      // If two book update is the same then update the quantity and others follow req.bod
      if (importLogDetail.bookId.id == bookDetail.id) {
        let oldImportLogQuantity = importLogDetail.quantity;
        let newImportLogQuantity = Number(req.body.bookQuantity);
        let currentBookQuantity = bookDetail.quantity;

        let quantityChange = (oldImportLogQuantity - newImportLogQuantity);

        await BookModel.findByIdAndUpdate({ id: req.body.bookId }, {
          $set: {
            quantity: (currentBookQuantity + quantityChange),
          }
        })

        // Update import log data
        await ImportLogModel.findByIdAndUpdate({ id: req.params.importLogId }, {
          $set: {
            managerId: req.session.tokenUserId,
            bookId: req.body.bookId,
            supplier: req.body.bookSupplier,
            quantity: newImportLogQuantity,
            updatedat: new Date(),
          }
        })

        res.redirect("/admin/dashboard/import_log_management");
      } else {
        
        // 2 books is not the same
        let oldImportLogQuantity = importLogDetail.quantity;
        let oldBookCurrentQuantity = importLogDetail.bookId.quantity;
        let oldBookId = importLogDetail.bookId;
        let newBookId = req.body.bookId;
        let newImportLogQuantity = req.body.bookQuantity;

        console.log(typeof importLogDetail.bookId);
        // Revert import quantity for the old book
        await BookModel.findByIdAndUpdate({ id: oldBookId }, {
          $set: {
            quantity: (oldBookCurrentQuantity - oldImportLogQuantity),
          }
        })

        // Add new quantity to new book
        await BookModel.findByIdAndUpdate({ _id: newBookId }, {
          $inc: {
            quantity: newImportLogQuantity
          }
        })
        

        // Update import log data
        await ImportLogModel.findByIdAndUpdate({ id: req.params.importLogId }, {
          $set: {
            managerId: req.session.tokenUserId,
            bookId: req.body.bookId,
            supplier: req.body.bookSupplier,
            quantity: newImportLogQuantity,
            updatedat: new Date(),
          }
        })

        res.redirect("/admin/dashboard/import_log_management");
      }
    } else {
      res.render("errorPage", {message: "Import and Book not found!", })
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});