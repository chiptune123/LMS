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
            res.render("author_list", { title: "Author List", author_list: allAuthors });
        } else {
            res.status(404).render("errorPage", { message: "No Author Found!", errorStatus: 404 });
        }
    } catch (err) {
        res.render("errorPage", { message: err, errorStatus: 500 });
    }
});

exports.author_detail = asyncHandler(async (req, res, next) => {
    try {
        const authorDetail = await AuthorModel.findById(req.params.id).exec();

        if (authorDetail) {
            res.render("author_detail", { title: "Author Detail", author_detail: authorDetail });
        } else {
            res.status(404).render("errorPage", { message: "Author detail not found!", errorStatus: 404 });
        }
    } catch (err) {
        res.status(500).render("errorPage", { message: err, errorStatus: 500 });
    }
});

exports.author_create_get = asyncHandler(async (req, res, next) => {
    try {
        res.render("author_create_form", { title: "Author Create" });
    } catch (err) {
        res.status(500).render("errorPage", { message: err, status: 500 });
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
        res.redirect("/authors");

    } catch (err) {
        res.status(500).render("errorPage", { message: err, errorStatus: 500 });
    }
});

exports.author_update_get = asyncHandler(async (req, res, next) => {
    try {
        const authorDetail = await AuthorModel.findOne({ _id: req.params.id }).exec();

        if (authorDetail) {
            res.render("author_update_form", { title: "Author Update", author_detail: authorDetail });
        } else {
            res.status(404).render("errorPage", { message: "Author not found!", errorStatus: 404 });
        }
    } catch (err) {
        res.status(500).render("errorPage", { message: err, errorStatus: 500 });
    }
});

exports.author_update_post = asyncHandler(async (req, res, next) => {
    try {
        await AuthorModel.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                name: req.body.name,
                bio: req.body.bio,
                deleteReason: req.body.deleteReason,
                deleteStatus: req.body.deleteStatus,
                profilePicturePath: req.body.profilePicturePath,
            }
        });

        res.redirect("/authors");
    } catch (err) {
        res.status(500).render("errorPage", { message: err, errorStatus: 500 });
    }
});

exports.author_delete_get = asyncHandler(async (req, res, next) => {
    try {
        const authorDetail = await AuthorModel.findOne({ _id: req.params.id });

        if (authorDetail) {
            res.render("author_delete_form", { title: "Author Delete", author_detail: authorDetail });
        } else {
            res.status(404).render("errorPage", { message: "Author not found!", errorStatus: 404 });
        }
    } catch (err) {
        res.status(500).render("errorPage", { message: err, errorStatus: 500 });
    }
});

exports.author_delete_post = asyncHandler(async (req, res, next) => {
    try {
        const [authorDetail, allBookByAuthor] = await Promise.all([
            AuthorModel.findById(req.params.id).exec(),
            BookModel.find({ author: req.params.id }, "title author description")
        ]);

        if (authorDetail === null) {
            res.status(404).render("errorPage", { message: "Author not found!", errorStatus: 404 });
        }

        // If the author has any associate book -> render the delete form again with error and all book which associate.
        if (allBookByAuthor.length > 0) {
            res.status(500).render("author_delete_form", {
                author_detail: authorDetail,
                all_book_by_author: allBookByAuthor,
            });
        }

        await AuthorModel.findByIdAndDelete(req.params.id);
        res.redirect("/authors");
    } catch (err) {
        res.status(500).render("errorPage", { message: err, errorStatus: 500 });
    }
});