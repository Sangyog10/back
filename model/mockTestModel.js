import mongoose from "mongoose";

// Schema for individual questions
const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
});

// Schema for subject-specific results
const subjectResultSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  correctCount: {
    type: Number,
    required: true,
  },
  wrongCount: {
    type: Number,
    required: true,
  },
  selectedAnswers: {
    type: [String],
    required: true,
  },
});

// Schema for individual submissions
const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subjectResults: {
      type: [subjectResultSchema],
      required: true,
    },
    selectedAnswers: {
      type: Map,
      of: Number, // Stores question index and selected option index
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Main schema for the mock test
const mockTestSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
    submissions: {
      type: [submissionSchema],
    },
  },
  { timestamps: true }
);

export default mongoose.model("MockTest", mockTestSchema);
