import mongoose from "mongoose";

// Define study material schema for each video
const studyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String, // e.g., "pdf", "document", "link"
    required: true,
  },
  url: {
    type: String, // URL of the file or link
    required: true,
  },
  fileName: {
    type: String, // File name for downloadable materials (optional)
  },
  description: {
    type: String, // Optional description for the study material
  },
  size: {
    type: Number, // Size of the file in bytes (optional)
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
