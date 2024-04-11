const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  deleteStatus: { type: Boolean, required: true, default: false },
  deleteReason: { type: String, maxLength: 500 },
});

module.exports = mongoose.model("Subject", SubjectSchema);
