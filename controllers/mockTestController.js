import MockTest from "../model/mockTestModel.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/index.js";

// Create a new Mock Test (Admin)
const createMockTest = async (req, res) => {
  const { title, description, subject, questions } = req.body;

  if (!title || !subject || !questions || questions.length === 0) {
    throw new BadRequestError(
      "Title, subject, and at least one question are required."
    );
  }

  const mockTest = await MockTest.create({
    title,
    description,
    subject,
    questions,
  });

  res.status(StatusCodes.CREATED).json({ mockTest });
};

// Get All Mock Tests (Public)
const getAllMockTests = async (req, res) => {
  const { subject } = req.query; // Filter by subject
  const queryObject = {};

  if (subject) {
    queryObject.subject = subject;
  }

  const mockTests = await MockTest.find(queryObject).select(
    "title subject description createdAt"
  );

  res.status(StatusCodes.OK).json({ count: mockTests.length, mockTests });
};

// Get Single Mock Test (Public)
const getSingleMockTest = async (req, res) => {
  const { id: mockTestId } = req.params;

  const mockTest = await MockTest.findById(mockTestId);
  if (!mockTest) {
    throw new NotFoundError(`No Mock Test found with ID: ${mockTestId}`);
  }

  res.status(StatusCodes.OK).json({ mockTest });
};

// Delete Mock Test (Admin)
const deleteMockTest = async (req, res) => {
  const { id: mockTestId } = req.params;

  const mockTest = await MockTest.findByIdAndDelete(mockTestId);
  if (!mockTest) {
    throw new NotFoundError(`No Mock Test found with ID: ${mockTestId}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Mock Test deleted successfully" });
};

// Submit Answers to a Subject-Specific Mock Test (User)
const submitMockTest = async (req, res) => {
  const { id: mockTestId } = req.params;
  const { answers } = req.body; // User's answers

  const mockTest = await MockTest.findById(mockTestId);
  if (!mockTest) {
    throw new NotFoundError(`No Mock Test found with ID: ${mockTestId}`);
  }

  let score = 0;
  const results = [];

  // Calculate score
  mockTest.questions.forEach((question, index) => {
    const userAnswer = answers.find(
      (answer) => String(answer.questionId) === String(question._id)
    );

    if (userAnswer) {
      const isCorrect = userAnswer.selectedOption === question.correctAnswer;
      if (isCorrect) score++;
      results.push({
        questionId: question._id,
        selectedOption: userAnswer.selectedOption,
        isCorrect,
      });
    } else {
      results.push({
        questionId: question._id,
        selectedOption: null,
        isCorrect: false,
      });
    }
  });

  // Save submission
  mockTest.submissions.push({
    user: req.user.userId,
    answers: results,
    score,
  });

  await mockTest.save();

  res.status(StatusCodes.OK).json({
    msg: "Submission successful",
    subject: mockTest.subject,
    score,
    totalQuestions: mockTest.questions.length,
    results,
  });
};

const getQuestionsBySubject = async (req, res) => {
  const { subject } = req.query;

  if (!subject) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Subject is required" });
  }

  // Find all mock tests that contain questions with the specified subject
  const mockTests = await MockTest.find({ "questions.subject": subject });

  if (!mockTests.length) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No questions found for this subject" });
  }

  // Extract all questions matching the subject from the mock tests
  const questions = mockTests
    .map((test) => test.questions.filter((q) => q.subject === subject))
    .flat();

  res.status(StatusCodes.OK).json({ subject, questions });
};

export {
  createMockTest,
  getAllMockTests,
  getSingleMockTest,
  deleteMockTest,
  submitMockTest,
  getQuestionsBySubject,
};
