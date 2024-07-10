const FeedbackModel = require("../models/feedbacks");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.feedback_list = asyncHandler(async (req, res, next) => {
  try {
    const feedbackList = await FeedbackModel.find({})
      .sort({ creationDate: 1 })
      .exec();

    if (feedbackList) {
      if (req.baseUrl == "/admin") {
        res.render("feedbackManagement", { title: "Feedback Collection", feedback_list: feedbackList });
        return;
      }
      res.render("contact", {
        title: "Feedback list",
        feedback_list: feedbackList,
      });
    } else {
      res.status(404).render("errorPage", { message: "Author list not found!", errorStatus: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
  }
});

exports.feedback_detail = asyncHandler(async (req, res, next) => {
  const feedbackDetail = await FeedbackModel.findById(req.params.id).exec();

  if (feedbackDetail) {
    res.render("feedback_detail_form", {
      title: "Feedback Detail",
      feedback_detail: feedbackDetail,
    });
  } else {
    res.render("errorPage", { status: 404, message: "Feedback not found!" })
  }
});

exports.feedback_create_get = asyncHandler(async (req, res, next) => {
  res.render("contact", { title: "Feedback Create" });
});

exports.feedback_create_post = asyncHandler(async (req, res, next) => {
  const currentDate = new Date();
  console.log(req.body);
  const NewFeedback = new FeedbackModel({
    creationDate: currentDate,
    name: req.body.name,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    feedbackType: req.body.feedbackType,
    feedbackMessage: req.body.feedbackMessage,
    attachment: req.body.attachment,
  });

  await NewFeedback.save();
  res.redirect("/");
});

exports.feedback_update_get = asyncHandler(async (req, res, next) => {
  const feedbackDetail = FeedbackModel.findById(req.params.id);

  if (!feedbackDetail) {
    res.render("errorPage", { errorStatus: 404 });
  } else {
    res.render("feedback_update_form", {
      title: "Feedback Update",
      feedback: feedbackDetail,
    });
  }
});

exports.feedback_update_post = asyncHandler(async (req, res, next) => {
  const currentDate = new Date();

  //const NewFeedback = await FeedbackModel.findOne(req.params.id);
  FeedbackModel.updateOne(
    { _id: req.params.id },
    {
      $set: {
        creationDate: currentDate,
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        feedbackType: req.body.feedback,
        feedbackMessage: req.body.feedbackMessage,
        feedbackStatus: req.body.feedbackStatus,
        attachment: req.body.attachment,
      },
    }
  );

  res.redirect("/feedbacks");
});

exports.feedback_delete_get = asyncHandler(async (req, res, next) => {
  const feedbackDetail = await FeedbackModel.findById(req.params.id);

  if (!feedbackDetail) {
    res.render("errorPage", { errorStatus: 404 });
  } else {
    res.render("feedback_detail_delete", { title: "Feedback Delete", feedback_detail: feedbackDetail });
  }
});

exports.feedback_delete_post = asyncHandler(async (req, res, next) => {
  try {
    await FeedbackModel.findByIdAndDelete(req.params.id).exec();
  } catch (err) {
    res.render("errorPage", { message: err, status: 404 });
  }
});

exports.feedback_update_status = asyncHandler(async (req, res, next) => {
  try {
    const currentDate = new Date();
    let feedback_status = false;

    if (req.body.feedbackStatus === "Completed") {
      feedback_status = true;
    }

    await FeedbackModel.updateOne({ _id: req.params.id },
      {
        $set: {
          creationDate: currentDate,
          feedbackStatus: feedback_status
        }
      }).exec();

    res.redirect("/feedbacks");
  } catch (err) {
    res.render("errorPage", { message: err, status: 404 });
  }
});
