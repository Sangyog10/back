import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true, // The question text
  },
  options: {
    type: [String], // Array of options for the question
    required: true,
    validate: {
      validator: (val) => val.length === 4, // Ensure exactly 4 options
      message: "There must be exactly 4 options.",
    },
  },
  correctAnswer: {
    type: String, // The correct answer for the question (must match one of the options)
    required: true,
  },
});

const mockTestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Title of the mock test
    },
    description: {
      type: String, // A brief description of the test
    },
    questions: {
      type: [questionSchema], // Array of questions
      required: true,
    },
    submissions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the user who submitted
          required: true,
        },
        answers: [
          {
            questionId: {
              type: mongoose.Schema.Types.ObjectId, // Reference to a question in the mock test
              required: true,
            },
            selectedOption: {
              type: String, // The option selected by the user
              required: true,
            },
          },
        ],
        score: {
          type: Number, // Calculated score for the submission
          required: true,
        },
        submittedAt: {
          type: Date, // When the submission was made
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("MockTest", mockTestSchema);
