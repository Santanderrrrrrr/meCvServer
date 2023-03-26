const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    content: [{
      type: String,
      required: true,
    }],
    dateFrom: {
      type: Date,
    },
    dateTo: {
      type: Date,
    },
  },
  { timestamps: true, minimize: false }
);

module.exports = mongoose.model("SubSection", subSectionSchema);
