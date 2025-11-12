// routers/search.js
import express from "express";
import {
  textToVector,
  MODEL_NAME as CLIP_MODEL,
} from "../utils/textEmbedder.js";
import { searchImage } from "../model/imageModel.js";

const router = express.Router();

/**
 * POST /api/v1/search/images
 * body: { text: "black cat", limit?: 12 }
 * returns: { status, count, results: [{ _id, imageUrl, model, dims, score }] }
 */
router.post("/images", async (req, res) => {
  try {
    const { text, limit } = req.body || {};
    if (!text || !String(text).trim()) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide 'text' to search.",
      });
    }

    // 1) Embed the query using CLIP TEXT tower (unit-normalized)
    const queryVector = await textToVector(text);

    // 2) Vector search in MongoDB Atlas
    const results = await searchImage(queryVector, limit, {
      modelName: CLIP_MODEL,
      dims: queryVector.length, // e.g., 512 for ViT-B/32
    });

    return res.status(200).json({
      status: "success",
      count: results.length,
      results,
    });
  } catch (err) {
    console.error("Image search failed:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to search images.",
      error: err.message,
    });
  }
});

export default router;
