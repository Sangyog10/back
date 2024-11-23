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
  subject: {
    type: String,
    required: true,
  },
});

// Schema for subject-specific results
const subjectResultSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  wrongCount: { type: Number, required: true },
  selectedAnswers: { type: [String], required: true },
}, { _id: false });

const submissionSchema = new mongoose.Schema(
  {
    questions: { type: Array, required: true }, // Array of questions
    subjectResults: { type: [subjectResultSchema], required: true }, // Array of subject results
    selectedAnswers: { type: Map, of: Number, required: true }, // Object with selected indexes
    totalScore: { type: Number, required: true }, // Total score
    totalQuestions: { type: Number, required: true }, // Total questions answered
    submittedAt: { type: String, required: true }, // Submission timestamp
  }, {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
)

// Schema for mock test
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
