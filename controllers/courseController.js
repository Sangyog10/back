import courseModel from "../model/courseModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequestError } from "../errors/index.js";
import userModel from "../model/userModel.js";

// Add a new course
const addCourse = async (req, res) => {
  const {
    title,
    description,
    thumbnail,
    instructor,
    category,
    price,
    sections,
    status,
    level,
    assignments,
    progress,
    quizzes,
  } = req.body;

  if (
    !title ||
    !description ||
    !thumbnail ||
    !instructor ||
    !category ||
    !price ||
    !level
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
    status: status || "available",
    level,
    assignments: assignments || 0,
    progress: progress || 0,
    quizzes: quizzes || Math.floor(Math.random() * 20) + 1,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Course created successfully",
    course,
  });
};

const getAllCourses = async (req, res) => {
  const { category, minPrice, maxPrice, level } = req.query;

  const query = {};

  if (category) {
    query.category = category;
  }

  if (level) {
    query.level = level;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  try {
    const courses = await courseModel.find(
      query,
      "title thumbnail description category price level status progress totalDuration sections"
    );

    // Check if courses are found
    if (!courses || courses.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No courses found." });
    }

    // Add totalDuration to each course
    const coursesWithDetails = courses.map((course) => {
      // Ensure totalDuration is correctly calculated
      const totalDuration = course.totalDuration || "00:00:00"; // Default if no totalDuration exists
      return { ...course.toObject(), totalDuration };
    });

    res.status(StatusCodes.OK).json({ courses: coursesWithDetails });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An error occurred while fetching courses." });
  }
};

// Get course details by ID
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

// Add a new video to a section with optional study materials
const addVideo = async (req, res) => {
  const { courseId, sectionId } = req.params;
  const { title, duration, videoUrl, partNumber, studyMaterials } = req.body;

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
    studyMaterials: studyMaterials || [],
  };

  section.videos.push(newVideo);

  await course.save();

  res.status(StatusCodes.CREATED).json({
    msg: "Video added successfully",
    section,
  });
};

// Update study materials for a specific video
const updateStudyMaterials = async (req, res) => {
  const { courseId, sectionId, videoId } = req.params;
  const { studyMaterials } = req.body;

  if (!studyMaterials || studyMaterials.length === 0) {
    throw new BadRequestError("At least one study material is required.");
  }

  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new NotFoundError(`No course found with ID: ${courseId}`);
  }

  const section = course.sections.id(sectionId);
  if (!section) {
    throw new NotFoundError(`No section found with ID: ${sectionId}`);
  }

  const video = section.videos.id(videoId);
  if (!video) {
    throw new NotFoundError(`No video found with ID: ${videoId}`);
  }

  video.studyMaterials = studyMaterials;

  await course.save();

  res.status(StatusCodes.OK).json({
    msg: "Study materials updated successfully",
    video,
  });
};

// Get study materials for a specific video
const getStudyMaterials = async (req, res) => {
  const { courseId, sectionId, videoId } = req.params;

  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new NotFoundError(`No course found with ID: ${courseId}`);
  }

  const section = course.sections.id(sectionId);
  if (!section) {
    throw new NotFoundError(`No section found with ID: ${sectionId}`);
  }

  const video = section.videos.id(videoId);
  if (!video) {
    throw new NotFoundError(`No video found with ID: ${videoId}`);
  }

  res.status(StatusCodes.OK).json({
    studyMaterials: video.studyMaterials,
  });
};
const purchaseCourse = async (req, res) => {
  const { userId, courseId } = req.params; 
  const user = await userModel.findById(userId);
  if (!user) {
    throw new NotFoundError(`No user found with ID: ${userId}`);
  }

  const course = await courseModel.findById(courseId);
  if (!course) {
    throw new NotFoundError(`No course found with ID: ${courseId}`);
  }

  if (user.courses.includes(courseId)) {
    throw new BadRequestError("You have already purchased this course.");
  }

  user.courses.push(courseId);

  await user.save();

  res.status(StatusCodes.OK).json({
    msg: "Course purchased successfully",
    courses: user.courses,
  });
};

export {
  getAllCourses,
  getCourseDetails,
  getVideoDetails,
  addCourse,
  addSection,
  addVideo,
  updateStudyMaterials,
  getStudyMaterials,
  purchaseCourse
};
