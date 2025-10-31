import express from "express";
import upload from "../config/multerConfig.js";
import { HfInference } from "@huggingface/inference";
import { imageUploadCheck } from "../middlewares/imageUploadValidatior.js";
import { imageUploadController } from "../controller/imageUploadController.js";

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  imageUploadCheck,
  imageUploadController
);

// Create Vector embeddings
const hfKey = process.env.HF_API_KEY;
const hf = new HfInference(hfKey);

async function getEmbeddings(text) {
  const res = await hf.featureExtraction({
    model: "sentence-transformers/all-MiniLM-L6-v2",
    inputs: text,
  });
  return res; // returns embedding vector
}

// POST /vectorize
router.post("/vectorize", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide text to generate embeddings.",
      });
    }

    const embeddings = await getEmbeddings(text);

    res.status(200).json({
      status: "success",
      message: "Vector embeddings created successfully",
      text,
      embeddings,
    });
  } catch (error) {
    console.error("Error creating embeddings:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to create embeddings",
      error: error.message,
    });
  }
});

export default router;
