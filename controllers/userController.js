const User = require('../models/users');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.user_list = asyncHandler(async (req, res, next) => {
    const allUsers = await User.find({}, "username name email")
        .sort({ username: 1 })
        .exec();
    res.render("user_list", { title: "User List", user_list: allUsers });
})

exports.user_detail = asyncHandler(async (req, res, next) => {
    const userDetail = await User.findOne({ username: req.params.id }).exec();
    res.render("user_detail", { user_information: userDetail });
})

// User manipulate on GET HTTP method
exports.user_create_get = asyncHandler((req, res, next) => {
    res.render("sign_up_form", { title: "Create User" });
})

exports.user_update_get = asyncHandler(async (req, res, next) => {
    const userDetail = await User.findOne({ username: req.params.id }).exec();
    res.render("user_update_form", {title: "User Update", user: userDetail });
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

exports.user_update_post = [
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
            username: req.params.id,
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            role: req.body.role,
            verificationStatus: req.body.verificationStatus,
            profilePicture: req.body.profilePicture,
            deleteStatus: req.body.deleteStatus,
            deleteReason: req.body.deleteReason
            // Other field has default value for user to optional setup
        })

        if (!errors.isEmpty()) {
            // If there are errors, render the form again with validation data and errors object
            res.render("user_update_form", {
                title: "Update User",
                user: NewUser,
                errors: errors.array(),
            })
        } else {
            const updateUser = await User.findOneAndUpdate({username: req.params.id}, {$set:{
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            role: req.body.role,
            verificationStatus: req.body.verificationStatus,
            profilePicture: req.body.profilePicture,
            deleteStatus: req.body.deleteStatus,
            deleteReason: req.body.deleteReason
            }});
            res.redirect('/login');
        }
    })
]

exports.user_delete_post = asyncHandler((req, res, next) => {
    res.send("NOT IMPLEMENTED: User delete post ");
})