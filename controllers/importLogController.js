const BookModel = require("../models/books");

const asyncHandler = require("express-async-handler");

exports.import_create_get = asyncHandler(async (req, res, next) => {
  try{
    const bookList = await BookModel.find({});

    res.render("import_create_form", {title: "Import create", book_list: bookList});
  } catch (err) {
    res.status(500).render("errorPage", {message: err, errorStatus: 500});
  }
});


