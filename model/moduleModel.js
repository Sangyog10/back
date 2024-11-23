const moduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    duration: {
      type: Number, // Calculate total duration from associated videos
    },
  },
  { timestamps: true }
);

export default mongoose.model("Module", moduleSchema);
