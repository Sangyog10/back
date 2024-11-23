import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true, // URL to the video file or streaming link
    },
    duration: {
      type: Number,
      required: true, // Duration in minutes or seconds
    },
    description: {
      type: String,
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module", // Associate video with a specific module
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
