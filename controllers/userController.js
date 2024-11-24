import userModel from "../model/userModel.js";
import NotFoundError from "../errors/not-found.js";
import noteModel from "../model/noteModel.js";
import { StatusCodes } from "http-status-codes";

const getUserCourses = async (req, res) => {
  const { userId } = req.user;

  const user = await userModel.findById(userId).populate("courses");

  if (!user) {
    throw new NotFoundError(`No user found with ID: ${userId}`);
  }

  if (user.courses.length === 0) {
    return res.status(StatusCodes.OK).json({
      msg: "User has not purchased any courses.",
      courses: [],
    });
  }

  res.status(StatusCodes.OK).json({
    msg: "List of purchased courses",
    courses: user.courses,
  });
};

const getUserNotes = async (req, res) => {
  const { userId } = req.user;
  try {
    const userNotes = await noteModel.find({ createdBy: userId });
    res.status(200).json(userNotes);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching notes", error: err.message });
  }
};

export { getUserCourses, getUserNotes };
