import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  imageVector: {
    type: [Number],
    index: "vector",
  },
  dims: Number,
  model: { type: String },
});

export default mongoose.model("Image", imageSchema);
