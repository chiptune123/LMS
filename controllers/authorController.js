const AuthorModel = require("../models/authors");
const BookModel = require("../models/books");
const asyncHandler = require("express-async-handler");
const { body, validatorResult } = require("express-validator");

exports.author_list = asyncHandler(async (req, res, next) => {
    try {
        const allAuthors = await AuthorModel.find()
            .sort({ username: 1 })
            .exec();

        if (allAuthors) {
            if (req.baseUrl == "/admin") {
                res.render("author_management", {
                    title: "Author Collection",
                    author_list: allAuthors,
                });
                return;
            }
            res.render("author_list", { title: "Author Collection", author_list: allAuthors });
            return;
        } else {
            res.status(404).render("errorPage", { message: "No Author Found!", errorStatus: 404 });
        }
    } catch (err) {
        res.render("errorPage", { message: err, errorStatus: 500 });
    }
});

exports.author_detail = asyncHandler(async (req, res, next) => {
    try {
        const [authorDetail, bookByAuthor] = await Promise.all([AuthorModel.findById(req.params.authorId).exec(), BookModel.find({ author: req.params.authorId })]);

        if (authorDetail && bookByAuthor) {
            res.render("author_detail", { title: "Author Detail", author_detail: authorDetail, book_list: bookByAuthor });
        } else {
            res.status(404).render("errorPage", { message: "Author detail not found!", errorStatus: 404 });
        }
    } catch (err) {
        res.status(500).render("errorPage", { message: err, errorStatus: 500 });
    }
});


exports.author_create_post = asyncHandler(async (req, res, next) => {
    try {
        const newAuthor = new AuthorModel({
            name: req.body.authorName,
            bio: req.body.biography,
            profilePicturePath: req.body.profilePicturePath,
            // Other field will have their own default values
        })

        await newAuthor.save();
        res.redirect("/admin/dashboard/author_management");

    } catch (err) {
        res.status(500).render("errorPage", { message: err, errorStatus: 500 });
    }
});

exports.author_update_post = asyncHandler(async (req, res, next) => {
    try {
        await AuthorModel.findOneAndUpdate({ _id: req.params.authorId }, {
            $set: {
                name: req.body.authorName,
                bio: req.body.biography,
                deleteReason: req.body.deleteReason,
                deleteStatus: req.body.deleteStatus,
                profilePicturePath: req.body.profilePicturePath,
            }
        });
        res.redirect("/admin/dashboard/author_management");
    } catch (err) {
        res.status(500).render("errorPage", { message: err, errorStatus: 500 });
    }
});

exports.author_delete_post = asyncHandler(async (req, res, next) => {
    try {
        const [authorList, authorDetail, allBookByAuthor] = await Promise.all([
            AuthorModel.find({}).sort({ name: 1 }).exec(),
            AuthorModel.findById(req.params.authorId).exec(),
            BookModel.find({ author: req.params.authorId }, "title author description").exec()
        ]);

        // If the author has associate book, render the page again and send an error object to template
        if (authorDetail && (allBookByAuthor.length > 0)) {
            let errors = [];
            errors.push("Author Has Associated Books Error.");

            res.render("author_management", { title: "Author Collection", author_list: authorList, author_detail: authorDetail, book_list: allBookByAuthor, errors_object: errors })
        } else {
            res.render("author_management", { title: "Author Collection", author_list: authorList });
        }

        await AuthorModel.findByIdAndDelete(req.params.id);
        res.redirect("/authors");
    } catch (err) {
        res.status(500).render("errorPage", { message: err, errorStatus: 500 });
    }
});
