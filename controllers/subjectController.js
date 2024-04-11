const asyncHandler = require("express-async-handler");
const BookModel = require("../models/books");
const SubjectModel = require("../models/subjects");

exports.subject_list = asyncHandler((req, res, next) => {
  try {
    const allSubject = SubjectModel.find({});

    res.render("subject_list", { all_subject: allSubject });
  } catch (err) {
    res.status(500).render("errorPage", { message: err, status: 500 });
  }
});

exports.subject_detail = asyncHandler((req, res, next) => {});

exports.subject_create_get = asyncHandler((req, res, next) => {});

exports.subject_create_post = asyncHandler((req, res, next) => {});

exports.subject_update_get = asyncHandler((req, res, next) => {});

exports.subject_update_post = asyncHandler((req, res, next) => {});

exports.subject_delete_get = asyncHandler((req, res, next) => {});

exports.subject_delete_post = asyncHandler((req, res, next) => {});
