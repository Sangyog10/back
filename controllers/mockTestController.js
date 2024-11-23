import MockTest from "../model/mockTestModel.js";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/index.js";

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

const getSingleMockTest = async (req, res) => {
  const { id: mockTestId } = req.params;

  const mockTest = await MockTest.findById(mockTestId);
  if (!mockTest) {
    throw new NotFoundError(`No Mock Test found with ID: ${mockTestId}`);
  }

  res.status(StatusCodes.OK).json({ mockTest });
};

const deleteMockTest = async (req, res) => {
  const { id: mockTestId } = req.params;

  const mockTest = await MockTest.findByIdAndDelete(mockTestId);
  if (!mockTest) {
    throw new NotFoundError(`No Mock Test found with ID: ${mockTestId}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Mock Test deleted successfully" });
};

const submitMockTest = async (req, res) => {
  const { id: mockTestId } = req.params;
  const { selectedIndexes } = req.body; // User's selected answer indexes

  const mockTest = await MockTest.findById(mockTestId);
  if (!mockTest) {
    throw new NotFoundError(`No Mock Test found with ID: ${mockTestId}`);
  }

  let totalScore = 0;
  const subjectResults = [];

  // Calculate score and results per subject
  const results = mockTest.questions.map((question, index) => {
    const selectedOptionIndex = selectedIndexes[index];
    const isCorrect =
      question.options[selectedOptionIndex] === question.correctAnswer;
    if (isCorrect) totalScore++;

    return {
      questionId: question._id,
      selectedOption: question.options[selectedOptionIndex],
      isCorrect,
    };
  });

  // Aggregate subject results
  const subjectResult = {
    subject: mockTest.subject,
    score: totalScore,
    correctCount: results.filter((result) => result.isCorrect).length,
    wrongCount: results.filter((result) => !result.isCorrect).length,
    selectedAnswers: results.map((result) => result.selectedOption),
  };
  subjectResults.push(subjectResult);

  // Store submission
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

const getRandomQuestions = async (req, res) => {
  const { count = 10 } = req.query; // Number of random questions (default to 10)

  const mockTests = await MockTest.find();

  if (!mockTests.length) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "No mock tests found!" });
  }

  const allQuestions = mockTests.reduce((questions, mockTest) => {
    return questions.concat(mockTest.questions);
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

  res.status(StatusCodes.OK).json({
    count: selectedQuestions.length,
    questions: selectedQuestions,
  });
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
