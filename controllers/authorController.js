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
})

exports.author_detail = asyncHandler(async (req, res, next) => {

})

exports.author_create_get = asyncHandler(async (req, res, next) => {

})

exports.author_create_post = asyncHandler(async (req, res, next) => {

})

exports.author_update_get = asyncHandler(async (req, res, next) => {

})

exports.author_update_post = asyncHandler(async (req, res, next) => {

})

exports.author_delete_get = asyncHandler(async (req, res, next) => {

})

exports.author_delete_post = asyncHandler(async (req, res, next) => {

})