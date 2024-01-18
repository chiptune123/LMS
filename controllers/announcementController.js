const Announcement = require("../models/announcements");
const asyncHandler = require("express-async-handler");
const { body, validatorResult } = require("express-validator");
const User = require("../models/users");

exports.announcement_list = asyncHandler(async (req, res, next) => {
  const announcementList = await Announcement.find({})
    .populate('writerID')
    .sort({ creationDate: 1 })
    .exec();
  console.log(announcementList);
  res.render("announcement_list", {
    title: "Announcement List",
    announcement_list: announcementList,
  });
});

exports.announcement_create_get = asyncHandler(async (req, res, next) => {
  res.render("announcement_create_form", { title: "Create Announcement" });
});

exports.announcement_create_post = asyncHandler(async (req, res, next) => {
  const currentDate = new Date();
  const userDetail = await User.findOne({username: req.params.id}).exec();
  const NewAnnouncement = new Announcement({
    creationDate: currentDate,
    announcementContent: req.body.announcementContent,
    writerID: userDetail._id,
  });
  //testing
  console.log(NewAnnouncement);
  await NewAnnouncement.save();
  res.redirect("/announcements");
});

exports.announcement_detail = asyncHandler(async (req, res, next) => {
  const announcementDetail = await Announcement.findById(req.params.id).populate("writerID").exec();
  console.log(announcementDetail);
  res.render("announcement_detail", {
    title: "Announcement Detail",
    announcement_detail: announcementDetail,
  });
});

exports.announcement_delete_get = asyncHandler(async (req, res, next) => {
  res.send("Not implement announcement delete get");
});

exports.announcement_delete_post = asyncHandler(async (req, res, next) => {
  res.send("Not implement announcement delete post");
});

exports.announcement_update_get = asyncHandler(async (req, res, next) => {
  const currentAnnouncement = Announcement.findById(req.params.id);
  res.render("announcement_create_form", {current_announcement: currentAnnouncement});
});

exports.announcement_update_post = asyncHandler(async (req, res, next) => {
  res.send("Not implement announcement update post");
});
