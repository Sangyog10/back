import mongoose from "mongoose";

// Define study material schema for each video
const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
  },
  description: {
    type: String,
  },
  size: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define video schema including study materials
const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  partNumber: {
    type: Number,
    required: true,
  },
  studyMaterials: {
    type: [studyMaterialSchema],
    required: false, // Study materials are optional for each video
  },
});

// Define section schema with videos
const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videos: {
    type: [videoSchema],
    required: true,
  },
});

// Define course schema
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    sections: {
      type: [sectionSchema],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be greater than or equal to 0"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
