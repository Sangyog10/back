import MockTest from "../model/mockTestModel.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/index.js";

// Create a new mock test
const createMockTest = async (req, res) => {
  const { subject, questions } = req.body;

  if (!subject || !questions || questions.length === 0) {
    throw new BadRequestError(
      "Subject and at least one question are required."
    );
  }

  const mockTest = await MockTest.create({
    subject,
    questions,
  });

  res.status(StatusCodes.CREATED).json({ mockTest });
};

// Get all mock tests, optionally filtered by subject
const getAllMockTests = async (req, res) => {
  const { subject } = req.query; // Filter by subject
  const queryObject = {};

  if (subject) {
    queryObject.subject = subject;
  }

  const mockTests = await MockTest.find(queryObject).select(
    "subject createdAt"
  );

  res.status(StatusCodes.OK).json({ count: mockTests.length, mockTests });
};

// Get a single mock test by ID
const getSingleMockTest = async (req, res) => {
  const { id: mockTestId } = req.params;

  const mockTest = await MockTest.findById(mockTestId);
  if (!mockTest) {
    throw new NotFoundError(`No Mock Test found with ID: ${mockTestId}`);
  }

  res.status(StatusCodes.OK).json({ mockTest });
};

// Delete a mock test by ID
const deleteMockTest = async (req, res) => {
  const { id: mockTestId } = req.params;

  const mockTest = await MockTest.findByIdAndDelete(mockTestId);
  if (!mockTest) {
    throw new NotFoundError(`No Mock Test found with ID: ${mockTestId}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Mock Test deleted successfully" });
};

// Submit a mock test
const submitMockTest = async (req, res) => {
  const { id: mockTestId } = req.params;
  const { selectedIndexes } = req.body;

  const mockTest = await MockTest.findById(mockTestId);
  if (!mockTest) {
    throw new NotFoundError(`No Mock Test found with ID: ${mockTestId}`);
  }

  let totalScore = 0;
  const subjectResults = {};

  const results = mockTest.questions.map((question, index) => {
    const selectedOptionIndex = selectedIndexes[index];
    const isCorrect =
      question.options[selectedOptionIndex] === question.correctAnswer;

    if (!subjectResults[question.subject]) {
      subjectResults[question.subject] = { correct: 0, wrong: 0 };
    }

    if (isCorrect) {
      totalScore++;
      subjectResults[question.subject].correct++;
    } else {
      subjectResults[question.subject].wrong++;
    }

    return {
      questionId: question._id,
      selectedOption: question.options[selectedOptionIndex],
      isCorrect,
    };
  });

  mockTest.submissions.push({
    user: req.user.userId,
    subjectResults,
    selectedIndexes,
    totalScore,
    totalQuestions: mockTest.questions.length,
  });

  await mockTest.save();

  res.status(StatusCodes.OK).json({
    msg: "Submission successful",
    subject: mockTest.subject,
    score: totalScore,
    totalQuestions: mockTest.questions.length,
    results,
    subjectResults,
  });
};

const getRandomQuestions = async (req, res) => {
  const { count = 10 } = req.query;

  const mockTests = await MockTest.find();

  if (!mockTests.length) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No mock tests found!" });
  }

  const allQuestions = mockTests.reduce((questions, mockTest) => {
    return questions.concat(
      mockTest.questions.map((q) => ({
        ...q,
        subject: mockTest.subject,
      }))
    );
  }, []);

  if (!allQuestions.length) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No questions available in the database." });
  }

  const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

  const selectedQuestions = shuffledQuestions.slice(
    0,
    Math.min(count, allQuestions.length)
  );

  const subjectTracking = {};

  selectedQuestions.forEach((question) => {
    if (!subjectTracking[question.subject]) {
      subjectTracking[question.subject] = { correct: 0, wrong: 0 };
    }
  });
  res.status(StatusCodes.OK).json({
    count: selectedQuestions.length,
    questions: selectedQuestions,
    subjectTracking,
  });
};

const getQuestionsBySubject = async (req, res) => {
  const { subject } = req.query;

  if (!subject) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Subject is required" });
  }

  const mockTests = await MockTest.find({ subject });

  if (!mockTests.length) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No questions found for this subject" });
  }

  const questions = mockTests.flatMap((test) => test.questions);

  res.status(StatusCodes.OK).json({ subject, questions });
};

export {
  createMockTest,
  getAllMockTests,
  getSingleMockTest,
  deleteMockTest,
  submitMockTest,
  getQuestionsBySubject,
  getRandomQuestions,
};
