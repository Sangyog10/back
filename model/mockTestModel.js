import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (val) => val.length === 4,
      message: "There must be exactly 4 options.",
    },
  },
  correctAnswer: {
    type: String,
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
    subject: {
      type: String, // The subject of the mock test
      required: true,
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
            questionIndex: {
              type: Number,
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
