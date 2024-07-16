const Announcement = require("../models/announcements");
const asyncHandler = require("express-async-handler");
const { body, validatorResult } = require("express-validator");
const User = require("../models/users");

exports.announcement_list = asyncHandler(async (req, res, next) => {
  try {
    // Return empty array if no document is founded: []
    const announcementList = await Announcement.find({})
      .populate('writerId')
      .sort({ createdAt: 1 })
      .exec();

    if (announcementList) {
      if (req.baseUrl == "/admin") {
        res.render("announcement_management", { title: "Announcement Collection", announcement_list: announcementList });
        return;
      }

      res.render("announcement_list", {
        title: "Announcement List",
        announcement_list: announcementList,
      });
      return;
    }

  } catch (err) {
    res.status(500).render("errorPage", { message: err, errorStatus: 500 });
    return;
  }
});

exports.announcement_create_post = asyncHandler(async (req, res, next) => {
  const currentDate = new Date();
  const userDetail = await User.findById(req.session.tokenUserId);

  if (userDetail) {
    const NewAnnouncement = new Announcement({
      createdAt: currentDate,
      announcementContent: req.body.announcementContent,
      writerId: req.session.tokenUserId,
    });

    await NewAnnouncement.save();
    res.redirect("/admin/dashboard/announcement_management");
  }
});

exports.announcement_detail = asyncHandler(async (req, res, next) => {
  const announcementDetail = await Announcement.findById(req.params.announcementId).populate("writerId").exec();
  const announcementList = await Announcement.find({})
    .populate('writerId')
    .sort({ createdAt: 1 })
    .exec();

  res.render("announcement_detail", {
    title: "Announcement Detail",
    announcement_detail: announcementDetail,
    announcement_list: announcementList,
  });
});

exports.announcement_delete_post = asyncHandler(async (req, res, next) => {
  await Announcement.findByIdAndDelete(req.params.announcementId);
  res.redirect("/admin/dashboard/announcement_management");
});

exports.announcement_update_post = asyncHandler(async (req, res, next) => {

  const newAnnouncement = new Announcement({
    _id: req.params.announcementId,
    updatedAt: new Date(),
    announcementContent: req.body.announcementContentUpdate,
    writerId: req.body.writerId,
  })

  await Announcement.findByIdAndUpdate(req.params.announcementId, newAnnouncement);
  res.redirect(`/admin/dashboard/announcement_management`);
});
