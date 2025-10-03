import express from "express";
import upload from "../config/multerConfig.js";
const router = express.Router();

router.post("/", upload.array("images", 4), (req, res) => {

    console.log("Files received:", req.files);

  // checking response form cloudinary
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      status: "fail",
      message: "No images were uploaded to Cloudinary",
    });
  }

  const imageUrls = req.files.map((file) => file.path);
  // are all the urls are correct
  if (imageUrls.some((url) => !url)) {
    return res.status(500).json({
      status: "fail",
      message: "Image upload to Cloudinary failed",
    });
  }

  res.json({ status: "success", imageUrls: imageUrls });
});

export default router;
