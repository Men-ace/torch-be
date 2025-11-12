import { uploadImage } from "../model/imageModel.js";
import { addVectorDescription } from "../utils/addVectorDescription.js";

export const imageUploadController = async (req, res, next) => {
  try {
    const imageUrl = req.imageUrl;

    const image = await uploadImage(imageUrl);

    res.json({
      status: "success",
      message: "Image successfully uploaded",
      image,
    });

    // Run vector description creation asynchronously (non-blocking)
    addVectorDescription({
      _id: image._id,
      imageUrl: image.imageUrl,
    }).catch((err) => console.error("Embedding failed:", err));
  } catch (error) {
    next({
      statusCode: 500,
      message: error?.message || "Internal Error",
    });
  }
};
