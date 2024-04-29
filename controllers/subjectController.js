const asyncHandler = require("express-async-handler");
const BookModel = require("../models/books");
const SubjectModel = require("../models/subjects");

exports.subject_list = asyncHandler(async (req, res, next) => {
  try {
    const allSubject = await SubjectModel.find({});

    if(allSubject) {
      res.render("subject_list", { all_subject: allSubject });
    } else {
      res.status(404).render("errorPage", { message: "No subjects found!", errorStatus: 404});
    }
    
  } catch (err) {
    res.status(500).render("errorPage", { message: err, status: 500 });
  }
});

exports.subject_detail = asyncHandler(async (req, res, next) => {
  try {
    const subjectDetail = await SubjectModel.findById(req.params.id);

    if (subjectDetail) {
      res.render("subject_detail", { subject_detail: subjectDetail });
    } else {
      res
        .status(404)
        .render("errorPage", { message: "Subject not found!", status: 404 });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, status: 500 });
  }
});

exports.subject_create_get = asyncHandler(async (req, res, next) => {
  res.render("subject_create_form", { title: "Subject Create" });
});

exports.subject_create_post = asyncHandler(async (req, res, next) => {
  try {
    const newSubject = new SubjectModel({
      name: req.params.subjectName,
    });
    await newSubject.save();

    res.redirect("/subjects/");
  } catch (err) {
    res.status(500).render("errorPage", { message: err, status: 500 });
  }
});

exports.subject_update_get = asyncHandler(async (req, res, next) => {
  res.render("subject_update_form", { title: "Subject Update" });
});

exports.subject_update_post = asyncHandler(async (req, res, next) => {
  try {
    await SubjectModel.findOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.subjectName,
          deleteStatus: req.body.deleteStatus,
          deleteReason: req.body.deleteReason,
        },
      }
    );
  } catch (err) {
    res.status(500).render("errorPage", { message: err, status: 500 });
  }
});

exports.subject_delete_get = asyncHandler(async (req, res, next) => {
  try {
    const subjectDetail = await SubjectModel.findById(req.params.id);

    if (subjectDetail) {
      res.render("subject_delete_form", {
        title: "Subject Delete",
        subject_detail: subjectDetail,
      });
    } else {
      res.render("errorPage", {
        message: "Subject detail not found!",
        status: 500,
      });
    }
  } catch (err) {
    res.status(500).render("errorPage", { message: err, status: 500 });
  }
});

exports.subject_delete_post = asyncHandler(async (req, res, next) => {});
