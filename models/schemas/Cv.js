const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;


const cvSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectID,
      ref: "User",
      required: true,
    },
    sections: [
      {
        type: ObjectID,
        ref: "Section",
        required: true,
      },
    ],
    cvName: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, minimize: false }
);

module.exports = mongoose.model("CV", cvSchema);
