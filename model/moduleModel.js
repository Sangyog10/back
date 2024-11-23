const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    duration: {
      type: Number, // in minutes
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", moduleSchema);
