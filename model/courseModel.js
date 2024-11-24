import mongoose from "mongoose";

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
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String, // Format: "HH:mm:ss"
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
    required: false,
  },
});

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
    status: {
      type: String,
      enum: ["completed", "ongoing", "available"],
      default: "available",
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    assignments: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    quizzes: {
      type: Number,
    },
  },
  { timestamps: true }
);

courseSchema.virtual("totalDuration").get(function () {
  const parseDuration = (duration) => {
    const parts = duration.split(":").map(Number);
    const [hours = 0, minutes = 0, seconds = 0] = parts.reverse();
    return seconds + minutes * 60 + hours * 3600;
  };

  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  let totalSeconds = 0;

  this.sections.forEach((section) => {
    section.videos.forEach((video) => {
      totalSeconds += parseDuration(video.duration);
    });
  });

  return formatDuration(totalSeconds);
});

export default mongoose.model("Course", courseSchema);
