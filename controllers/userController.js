const User = require('../models/users');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.user_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User list");
})

exports.user_detail = asyncHandler((req, res, next) => {
    res.send("NOT IMPLEMENTED: User detail");
})

// User manipulate on GET HTTP method
exports.user_create_get = asyncHandler((req, res, next) => {
    res.render("sign_up_form", { title: "Create User" });
})

exports.user_update_get = asyncHandler((req, res, next) => {
    res.send("NOT IMPLEMENTED: User update get");
})

exports.user_delete_get = asyncHandler((req, res, next) => {
    res.send("NOT IMPLEMENTED: User delete get");
})

// User manipulate on POST HTTP method
exports.user_create_post = [
    // Validate and sanitizer field
    body("username")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Username must be specified."),
    body("password")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Password must be specified"),
        body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Name must be specified")
        .isAlphanumeric()
        .withMessage("Name has non-alphanumeric character"),
    body("email")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Email must be specified"),
    // Start to process request after validation
    asyncHandler(async (req, res, next) => {
        // Extract result object from express-validator
        const errors = validationResult(req);

        //Create User object with validation data
        const NewUser = new User({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            email: req.body.email,
            // Other field has default value for user to optional setup
        })

        if (!errors.isEmpty()) {
            // If there are errors, render the form again with validation data and errors object
            res.render("sign_up_form", {
                title: "Create User",
                user: NewUser,
                errors: errors.array(),
            })
        } else {
            await NewUser.save();
            res.redirect('/login');
        }
    })
]

exports.user_update_post = asyncHandler((req, res, next) => {
    res.send("NOT IMPLEMENTED: User update post");
})

exports.user_delete_post = asyncHandler((req, res, next) => {
    res.send("NOT IMPLEMENTED: User delete post ");
})