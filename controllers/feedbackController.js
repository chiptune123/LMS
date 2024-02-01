const FeedbackModel = require("../models/feedbacks");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.feedback_list = asyncHandler(async (req, res, next) => {
    const feedbackList = await FeedbackModel
        .find({}, "creationDate name email feedbackStatus")
        .sort({ creationDate: 1 })
        .exec();
    res.render("feedback_list", {
        title: "Feedback list",
        feedback_list: feedbackList
    });
});

exports.feedback_detail = asyncHandler(async (req, res, next) => { });

exports.feedback_create_get = asyncHandler(async (req, res, next) => { });

exports.feedback_create_post = asyncHandler(async (req, res, next) => { });

exports.feedback_update_get = asyncHandler(async (req, res, next) => { });

exports.feedback_update_post = asyncHandler(async (req, res, next) => { });

exports.feedback_delete_get = asyncHandler(async (req, res, next) => { });

exports.feedback_delete_post = asyncHandler(async (req, res, next) => { });
