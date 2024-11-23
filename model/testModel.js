const mongoose = require("mongoose");

// Mock Test Schema
const mockTestSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
            required: true,
          },
        ],
        correctAnswer: {
          type: Number, // Index of the correct option in the options array
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MockTest", mockTestSchema);
