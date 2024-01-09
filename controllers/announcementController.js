const Announcement = require('../models/announcements');
const asyncHandler = require('express-async-handler');
const { body, validatorResult } = require('express-validator');

exports.announcement_list = asyncHandler(async (req, res, next) => {
    const announcementList =  await Announcement.find({})
        .sort({ creationDate: 1 })
        .exec();
    console.log(announcementList);
    res.render("announcement_list", { title: "Announcement List", announcement_list: announcementList });
})

exports.announcement_create_get = asyncHandler(async (req,res,next) =>{
    res.render("announcement_create_form", {title:"Create announcement"});
})

exports.announcement_create_post = asyncHandler(async(req,res,next) =>{
    res.send("Not implement create post");
})

exports.announcement_detail = asyncHandler(async(req,res,next) =>{
    res.send("Not implement announcement detail");
})

exports.announcement_delete_get = asyncHandler(async(req,res,next) =>{
    res.send("Not implement announcement delete get");
})

exports.announcement_delete_post = asyncHandler(async(req,res,next) =>{
    res.send("Not implement announcement delete post");
})

exports.announcement_update_get = asyncHandler(async(req,res,next) =>{
    res.send("Not implement annoucement update get");
})

exports.announcement_update_post = asyncHandler(async(req,res,next) => {
    res.send("Not implement announcement update post")
})