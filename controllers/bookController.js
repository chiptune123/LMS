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
            res.status(404).render("errorPage", { message: "No Book Found", errorStatus: 404 });
        }
    } catch (err) {
        res.status(500).render("errorPage", { message: err, errorStatus: 500 });
    }
});

exports.book_detail = asyncHandler(async (req, res, next) => {
    try {
        const bookDetail = await BookModel.findById(req.params.id).exec();

        if (bookDetail) {
            res.render("book_detail", { title: "Book Detail", book_detail: bookDetail });
        } else {
            res.status(404).render("errorPage", { message: "No Book Found", errorStatus: 404 });
        }
    } catch (err) {
        res.status(500).render("errorPage", { message: err, errorStatus: 500 });
    }
});

exports.book_create_get = asyncHandler(async (req, res, next) => {

});

exports.book_create_post = asyncHandler(async (req, res, next) => {

});

exports.book_update_get = asyncHandler(async (req, res, next) => {

});

exports.book_update_post = asyncHandler(async (req, res, next) => {

});

exports.book_delete_get = asyncHandler(async (req, res, next) => {

});

exports.book_delete_post = asyncHandler(async (req, res, next) => {

});