const mongoose = require("mongoose");

// Mock Test Schema
const mockTestSchema = new mongoose.Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
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
          type: String,
          required: true,
        },
        category: {
          enum: ["Physics,chemikdfdskff,/////"],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MockTest", mockTestSchema);
