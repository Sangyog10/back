import Question from "../model/questionAskModel.js";
import Answer from "../model/answerModel.js";
import User from "../model/userModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../errors/index.js";

const createQuestion = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new BadRequestError("Title and Description are required.");
  }

  const question = await Question.create({
    title,
    description,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Question created successfully",
    question,
  });
};

const getAllQuestions = async (req, res) => {
  const { category, tags } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (tags) filter.tags = { $in: tags.split(",") };

  const questions = await Question.find(filter).populate(
    "askedBy",
    "name email"
  );

  if (!questions) {
    throw new NotFoundError("No questions found.");
  }

  res.status(StatusCodes.OK).json({ questions });
};

const getQuestionDetails = async (req, res) => {
  const { id } = req.params;

  const question = await Question.findById(id)
    .populate("askedBy", "name email")
    .populate({
      path: "answers",
      populate: { path: "answeredBy", select: "name email" },
    });

  if (!question) {
    throw new NotFoundError(`No question found with ID: ${id}`);
  }

  res.status(StatusCodes.OK).json({ question });
};

const createAnswer = async (req, res) => {
  const { id: questionId } = req.params;
  const { answerText } = req.body;

  if (!answerText) {
    throw new BadRequestError("Answer text is required.");
  }

  const question = await Question.findById(questionId);
  if (!question) {
    throw new NotFoundError(`No question found with ID: ${questionId}`);
  }

  const answer = await Answer.create({
    answerText,
    answeredBy: req.user.id,
    question: questionId,
  });

  question.answers.push(answer._id);
  await question.save();

  res.status(StatusCodes.CREATED).json({
    msg: "Answer posted successfully",
    answer,
  });
};

export { createQuestion, getAllQuestions, getQuestionDetails, createAnswer };
