const User = require('../models/users');
const asyncHandler = require('express-async-handler');

exports.user_list = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: User list");
})

exports.user_detail = asyncHandler((req,res,next) =>{
    res.send("NOT IMPLEMENTED: User detail");
})

// User manipulate on GET HTTP method
exports.user_create_get = asyncHandler((req,res,next) =>{
    res.send("NOT IMPLEMENTED: User create get");
})

exports.user_update_get = asyncHandler((req,res,next) =>{
    res.send("NOT IMPLEMENTED: User update get");
})

exports.user_delete_get= asyncHandler((req,res,next) =>{
    res.send("NOT IMPLEMENTED: User delete get");
})

// User manipulate on POST HTTP method
exports.user_create_post = asyncHandler((req,res,next) =>{
    res.send("NOT IMPLEMENTED: User create post");
})

exports.user_update_post = asyncHandler((req,res,next) =>{
    res.send("NOT IMPLEMENTED: User update post");
})

exports.user_delete_post= asyncHandler((req,res,next) =>{
    res.send("NOT IMPLEMENTED: User delete post ");
})