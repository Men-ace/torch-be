import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
   hasLink:{
    type: Boolean,
    default: true,
   },
  },
  decription:{

  },
  {
    timestamps: true,
  }
)

    const imageModel = mongoose.model("image", imageSchema);
export default imageModel;