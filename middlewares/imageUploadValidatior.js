export const imageUploadCheck = (req, res, next) => {
  try {
    // Check if a single image was uploaded
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "No image was uploaded to Cloudinary",
      });
    }

    const imageUrl = req.file.path;

    // Validate that the URL exists
    if (!imageUrl) {
      return res.status(500).json({
        status: "fail",
        message: "Image upload to Cloudinary failed",
      });
    }

    req.imageUrl = imageUrl; // store single image URL
    next();
  } catch (error) {
    next({
      statusCode: 500,
      message: error?.message || "Internal Error",
    });
  }
};
