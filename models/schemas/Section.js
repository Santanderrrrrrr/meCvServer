const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    subSections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true, minimize: false }
);

module.exports = mongoose.model("Section", sectionSchema);
