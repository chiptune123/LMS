const AuthorModel = require("../models/authors");
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
            res.status(404).render("errorPage", { message: "No Author Found!", status: 404 });
        }
    } catch (err) {
        res.render("errorPage", { message: err, status: 500 });
    }
});

exports.author_detail = asyncHandler(async (req, res, next) => {
    try {
        const authorDetail = await AuthorModel.findById(req.params.id).exec();

        if (authorDetail) {
            res.render("author_detail", { title: "Author Detail", author_detail: authorDetail });
        } else {
            res.status(404).render("errorPage", { message: "Author detail not found!", status: 404 });
        }
    } catch (err) {
        res.render.status(500).render("errorPage", { message: err, status: 404 });
    }
});

exports.author_create_get = asyncHandler(async (req, res, next) => {
    try {
        res.render("author_create_form", { title: "Author Create" });
    } catch (err) {
        res.status(500).render("errorPage", { message: err, status: 404 });
    }
});

exports.author_create_post = asyncHandler(async (req, res, next) => {
    try {
        const newAuthor = new AuthorModel({
            name: req.body.name,
            bio: req.body.bio,
            profilePicturePath: req.body.profilePicturePath,
            // Other field will have their own default values
        })

        await newAuthor.save();
        res.redirect("/authors");

    } catch (err) {
        res.status(500).render("errorPage", { message: err, status: 500 });
    }
});

exports.author_update_get = asyncHandler(async (req, res, next) => {
    try {
        const authorDetail = await AuthorModel.findOne({ _id: req.params.id }).exec();

        if (authorDetail) {
            res.render("author_update_form", { title: "Author Update", author_detail: authorDetail });
        } else {
            res.status(404).render("errorPage", { message: "Author not found!", status: 404 });
        }
    } catch (err) {
        res.status(500).render("errorPage", { message: err, status: 500 });
    }
});

exports.author_update_post = asyncHandler(async (req, res, next) => {
    try {
        AuthorModel.findOneAndUpdate({ _id: req.params.id }, {
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
        res.status(500).render("errorPage", { message: err, status: 500 });
    }
});

exports.author_delete_get = asyncHandler(async (req, res, next) => {

});

exports.author_delete_post = asyncHandler(async (req, res, next) => {

});