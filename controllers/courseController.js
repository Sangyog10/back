import courseModel from "../model/courseModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../errors/index.js";

const addCourse = async (req, res) => {
  const {
    title,
    description,
    thumbnail,
    instructor,
    category,
    price,
    sections,
  } = req.body;

  if (
    !title ||
    !description ||
    !thumbnail ||
    !instructor ||
    !category ||
    !price
  ) {
    throw new BadRequestError("All required fields must be provided.");
  }

  const course = await courseModel.create({
    title,
    description,
    thumbnail,
    instructor,
    category,
    price,
    sections: sections || [],
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Course created successfully",
    course,
  });
};

// Get all courses with optional filters for category and price range
const getAllCourses = async (req, res) => {
  const { category, minPrice, maxPrice } = req.query;

  const query = {};

  if (category) {
    query.category = category;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const courses = await courseModel.find(
    query,
    "title thumbnail description category price"
  );

  res.status(StatusCodes.OK).json({ courses });
};

const getCourseDetails = async (req, res) => {
  const { id } = req.params;
  const course = await courseModel.findById(id);
  if (!course) {
    throw new NotFoundError(`No course found with ID: ${id}`);
  }

  res.status(StatusCodes.OK).json({ course });
};

// Get video details by course and video ID
const getVideoDetails = async (req, res) => {
  const { courseId, videoId } = req.params;

  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new NotFoundError(`No course found with ID: ${courseId}`);
  }

  const video = course.sections
    .flatMap((section) => section.videos)
    .find((video) => String(video._id) === videoId);

  if (!video) {
    throw new NotFoundError(`No video found with ID: ${videoId}`);
  }

  res.status(StatusCodes.OK).json({ video });
};

// Add a new section to a course
const addSection = async (req, res) => {
  const { courseId } = req.params;
  const { title, videos } = req.body;

  if (!title) {
    throw new BadRequestError("Section title is required.");
  }

  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new NotFoundError(`No course found with ID: ${courseId}`);
  }

  const newSection = {
    title,
    videos: videos || [],
  };

  course.sections.push(newSection);

  await course.save();

  res.status(StatusCodes.CREATED).json({
    msg: "Section added successfully",
    course,
  });
};

// Add a new video to a section
const addVideo = async (req, res) => {
  const { courseId, sectionId } = req.params;
  const { title, duration, videoUrl, partNumber } = req.body;

  if (!title || !duration || !videoUrl) {
    throw new BadRequestError("Title, duration, and video URL are required.");
  }

  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new NotFoundError(`No course found with ID: ${courseId}`);
  }

  const section = course.sections.id(sectionId);
  if (!section) {
    throw new NotFoundError(`No section found with ID: ${sectionId}`);
  }

  const newVideo = {
    title,
    duration,
    videoUrl,
    partNumber: partNumber || section.videos.length + 1,
  };

  section.videos.push(newVideo);

  await course.save();

  res.status(StatusCodes.CREATED).json({
    msg: "Video added successfully",
    section,
  });
};

export {
  getAllCourses,
  getCourseDetails,
  getVideoDetails,
  addCourse,
  addSection,
  addVideo,
};
